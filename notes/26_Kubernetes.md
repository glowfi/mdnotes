# 🎯 Kubernetes Cheatsheet

## 1. 📁 NAMESPACE

### Definition

> Namespaces provide a mechanism for isolating groups of resources within a single cluster.

### YAML Template

```yaml
apiVersion: v1
kind: Namespace
metadata:
    name: my-app-dev # ⚠️ IMPORTANT: Use lowercase, no spaces
    labels:
        environment: dev # Optional: helps in filtering
```

### Quick Commands

```bash
# Create namespace
kubectl create namespace my-app-dev

# List namespaces
kubectl get namespaces

# Set default namespace for context
kubectl config set-context --current --namespace=my-app-dev

# Delete namespace (⚠️ DELETES EVERYTHING INSIDE!)
kubectl delete namespace my-app-dev
```

### ⚠️ Consequences of Wrong Configuration

| Mistake                     | Consequence                                      |
| --------------------------- | ------------------------------------------------ |
| Deleting namespace          | **ALL resources inside are deleted permanently** |
| Wrong namespace in commands | Resources created in wrong place, confusion      |
| No namespace specified      | Goes to `default` namespace                      |

### 📚 Documentation

- https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/

---

## 2. 🫛 POD

### Definition

> The **smallest deployable unit** in Kubernetes. A pod wraps one or more containers. Think of it as a **wrapper/box** for your container.

### YAML Template

```yaml
apiVersion: v1
kind: Pod
metadata:
    name: my-pod # ⚠️ IMPORTANT: Unique name in namespace
    namespace: my-app-dev # ⚠️ IMPORTANT: Specify or uses 'default'
    labels:
        app: my-app # ⚠️ CRITICAL: Used by Services to find pods
        version: v1
spec:
    containers:
        - name: my-container # ⚠️ IMPORTANT: Container name
          image: nginx:1.21 # ⚠️ CRITICAL: Image name and tag
          ports:
              - containerPort: 80 # ⚠️ IMPORTANT: Port your app listens on
          resources: # ⚠️ RECOMMENDED: Set limits
              requests:
                  memory: '64Mi'
                  cpu: '250m'
              limits:
                  memory: '128Mi'
                  cpu: '500m'
    restartPolicy: Always # Always | OnFailure | Never
```

### Quick Commands

```bash
# Create pod
kubectl apply -f pod.yaml

# List pods
kubectl get pods -n my-app-dev

# Describe pod (see events, errors)
kubectl describe pod my-pod -n my-app-dev

# Get pod logs
kubectl logs my-pod -n my-app-dev

# Execute command in pod
kubectl exec -it my-pod -n my-app-dev -- /bin/bash

# Delete pod
kubectl delete pod my-pod -n my-app-dev
```

### ⚠️ Consequences of Wrong Configuration

| Mistake              | Consequence                                          |
| -------------------- | ---------------------------------------------------- |
| Wrong image name/tag | `ImagePullBackOff` error, pod won't start            |
| Wrong containerPort  | App unreachable, connection refused                  |
| No resource limits   | Pod can consume all node resources, crash other pods |
| Missing labels       | Services can't find the pod                          |
| Wrong namespace      | Pod created in wrong namespace                       |

### 📚 Documentation

- https://kubernetes.io/docs/concepts/workloads/pods/

---

## 3. 🚀 DEPLOYMENT

### Definition

> Manages **multiple copies (replicas)** of your pod and handles **updates/rollbacks**. Think of it as a
> **pod manager** that ensures your desired number of pods are always running.

### YAML Template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: my-deployment
    namespace: my-app-dev
    labels:
        app: my-app
spec:
    replicas: 3 # ⚠️ IMPORTANT: Number of pod copies

    selector: # ⚠️ CRITICAL: Must match template labels
        matchLabels:
            app: my-app

    strategy: # ⚠️ IMPORTANT: How updates happen
        type: RollingUpdate # RollingUpdate | Recreate
        rollingUpdate:
            maxSurge: 1 # Extra pods during update
            maxUnavailable: 0 # Pods that can be unavailable

    template: # ⚠️ CRITICAL: Pod template
        metadata:
            labels:
                app: my-app # ⚠️ MUST match selector.matchLabels
        spec:
            containers:
                - name: my-app
                  image: nginx:1.21 # ⚠️ CRITICAL: Your app image
                  ports:
                      - containerPort: 80
                  resources:
                      requests:
                          memory: '64Mi'
                          cpu: '250m'
                      limits:
                          memory: '128Mi'
                          cpu: '500m'

                  livenessProbe: # ⚠️ RECOMMENDED: Restart if unhealthy
                      httpGet:
                          path: /health
                          port: 80
                      initialDelaySeconds: 30
                      periodSeconds: 10

                  readinessProbe: # ⚠️ RECOMMENDED: Traffic only when ready
                      httpGet:
                          path: /ready
                          port: 80
                      initialDelaySeconds: 5
                      periodSeconds: 5
```

### Quick Commands

```bash
# Create/Update deployment
kubectl apply -f deployment.yaml

# List deployments
kubectl get deployments -n my-app-dev

# Watch deployment status
kubectl rollout status deployment/my-deployment -n my-app-dev

# Scale deployment
kubectl scale deployment my-deployment --replicas=5 -n my-app-dev

# Update image (triggers rolling update)
kubectl set image deployment/my-deployment my-app=nginx:1.22 -n my-app-dev

# Rollback to previous version
kubectl rollout undo deployment/my-deployment -n my-app-dev

# See rollout history
kubectl rollout history deployment/my-deployment -n my-app-dev

# Delete deployment
kubectl delete deployment my-deployment -n my-app-dev
```

### ⚠️ Consequences of Wrong Configuration

| Mistake                                    | Consequence                             |
| ------------------------------------------ | --------------------------------------- |
| `selector.matchLabels` ≠ `template.labels` | Deployment won't find its pods, error   |
| `replicas: 0`                              | No pods running, app is down            |
| Wrong liveness probe                       | Pods keep restarting (CrashLoopBackOff) |
| Wrong readiness probe                      | No traffic sent to pods                 |
| No resource limits                         | Resource starvation                     |
| `strategy: Recreate`                       | Downtime during updates                 |

### 📚 Documentation

- https://kubernetes.io/docs/concepts/workloads/controllers/deployment/

---

## 4. 🌐 SERVICES

### Definition

> A **stable network endpoint** to access your pods. Pods can die and restart with new IPs,
> but Service IP stays the same. Think of it as a **load balancer + DNS name** for your pods.

---

### 4.1 ClusterIP (Default)

**What it does:**
Creates an internal IP address that's **only accessible from within the cluster**. Other pods can
reach your service, but nothing outside the cluster can.

**How it works:**

```
[Pod A] --> [ClusterIP: 10.96.50.100] --> [Your Pod B]
              (internal IP)
```

**Real-world analogy:**
Like an internal office phone extension - employees can call each other, but external clients can't dial extensions directly.

**When to use:**

- Backend services (databases, caches, internal APIs)
- Microservice-to-microservice communication
- Services that should NOT be exposed externally

```yaml
apiVersion: v1
kind: Service
metadata:
    name: my-service-clusterip
    namespace: my-app-dev
spec:
    type: ClusterIP # ⚠️ Default type (can omit)

    selector: # ⚠️ CRITICAL: Must match pod labels
        app: my-app

    ports:
        - name: http # ⚠️ RECOMMENDED: Name your ports
          protocol: TCP
          port: 80 # ⚠️ IMPORTANT: Service port (what you call)
          targetPort: 80 # ⚠️ IMPORTANT: Pod port (where it goes)
```

**Access within cluster:**

```bash
# From another pod
curl http://my-service-clusterip.my-app-dev.svc.cluster.local:80

# Short form (same namespace)
curl http://my-service-clusterip:80
```

---

### 4.2 NodePort

**What it does:**
Opens a **specific port (30000-32767) on every node** in your cluster. External
traffic hitting any node's IP on that port gets routed to your pods.

**How it works:**

```
[External User] --> [Any Node IP:30080] --> [ClusterIP] --> [Your Pods]
                         ↓
                    Node1:30080
                    Node2:30080  (same port on ALL nodes)
                    Node3:30080
```

**Real-world analogy:**
Like having the same extension number work at every office branch - call any branch at extension 30080, and you'll reach the same department.

**When to use:**

- Development/testing environments
- On-premise clusters without cloud load balancers
- When you need quick external access without Ingress setup

**⚠️ Limitations:**

- Port range restricted to 30000-32767
- Need to know node IPs
- If a node goes down, that IP stops working (no automatic failover)

```yaml
apiVersion: v1
kind: Service
metadata:
    name: my-service-nodeport
    namespace: my-app-dev
spec:
    type: NodePort # ⚠️ IMPORTANT: Exposes on node

    selector:
        app: my-app

    ports:
        - name: http
          protocol: TCP
          port: 80 # ClusterIP port
          targetPort: 80 # Pod port
          nodePort: 30080 # ⚠️ IMPORTANT: 30000-32767 range
```

**Access:**

```bash
# From outside cluster
curl http://<NODE-IP>:30080
```

---

### 4.3 LoadBalancer

**What it does:**
Provisions an **external load balancer from your cloud provider** (AWS ELB, GCP LB, Azure LB).
You get a single external IP/DNS that distributes traffic across your nodes.

**How it works:**

```
[External User] --> [Cloud LB: 52.1.2.3] --> [NodePort] --> [ClusterIP] --> [Pods]
                    (external IP)              (auto-created)  (auto-created)
```

**Real-world analogy:**
Like a company's main phone number with a receptionist - one public number that
routes calls to the right department, handles busy lines, and keeps working even if one office is closed.

**When to use:**

- Production workloads in cloud environments
- When you need a stable external IP
- High-availability requirements

```yaml
apiVersion: v1
kind: Service
metadata:
    name: my-service-lb
    namespace: my-app-dev
    annotations: # ⚠️ Cloud-specific annotations
        # AWS example:
        service.beta.kubernetes.io/aws-load-balancer-type: 'nlb'
spec:
    type: LoadBalancer # ⚠️ IMPORTANT: Creates cloud LB

    selector:
        app: my-app

    ports:
        - name: http
          protocol: TCP
          port: 80
          targetPort: 80
```

**Access:**

```bash
# Get external IP
kubectl get svc my-service-lb -n my-app-dev

# Access via external IP
curl http://<EXTERNAL-IP>:80
```

---

### Quick Commands

```bash
# Create service
kubectl apply -f service.yaml

# List services
kubectl get svc -n my-app-dev

# Describe service (see endpoints)
kubectl describe svc my-service -n my-app-dev

# Get endpoints (pods behind service)
kubectl get endpoints my-service -n my-app-dev

# Delete service
kubectl delete svc my-service -n my-app-dev
```

### ⚠️ Consequences of Wrong Configuration

| Mistake                             | Consequence                                  |
| ----------------------------------- | -------------------------------------------- |
| `selector` doesn't match pod labels | Service has no endpoints, connection refused |
| Wrong `targetPort`                  | Traffic sent to wrong port on pod            |
| `nodePort` outside 30000-32767      | Error, service won't create                  |
| LoadBalancer without cloud provider | Stays in "Pending" state forever             |
| Missing port name (multi-port)      | Ambiguous port reference                     |

### Service Type Comparison

| Type         | Access         | Use Case                     |
| ------------ | -------------- | ---------------------------- |
| ClusterIP    | Internal only  | Microservice-to-microservice |
| NodePort     | Node IP:30000+ | Dev/testing, on-prem         |
| LoadBalancer | External IP    | Production, cloud            |

### 📚 Documentation

- https://kubernetes.io/docs/concepts/services-networking/service/

---

## 5. ⚙️ CONFIGMAPS & SECRETS

### Definition

> **ConfigMap**: Store non-sensitive configuration data (settings, config files).
> **Secret**: Store sensitive data (passwords, tokens, keys) - base64 encoded.

Think of them as **external configuration** that you inject into pods.

---

### 5.1 ConfigMap - Environment Variables

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
    name: my-config
    namespace: my-app-dev
data: # ⚠️ Key-value pairs
    DATABASE_HOST: 'mysql.database.svc'
    DATABASE_PORT: '3306'
    LOG_LEVEL: 'info'
```

**Use in Deployment:**

```yaml
spec:
    containers:
        - name: my-app
          image: my-app:v1

          # Option 1: Single env var
          env:
              - name: DB_HOST
                valueFrom:
                    configMapKeyRef:
                        name: my-config # ⚠️ ConfigMap name
                        key: DATABASE_HOST # ⚠️ Key from ConfigMap

          # Option 2: All keys as env vars
          envFrom:
              - configMapRef:
                    name: my-config # ⚠️ All keys become env vars
```

---

### 5.2 ConfigMap - File Based

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
    name: my-config-file
    namespace: my-app-dev
data:
    nginx.conf: | # ⚠️ File name as key
        server {
            listen 80;
            server_name localhost;
            location / {
                root /usr/share/nginx/html;
            }
        }

    app.properties: |
        database.url=jdbc:mysql://localhost:3306/mydb
        cache.enabled=true
```

**Mount as Volume:**

```yaml
spec:
    containers:
        - name: my-app
          image: nginx:1.21
          volumeMounts:
              - name: config-volume
                mountPath: /etc/nginx/conf.d # ⚠️ Where files appear
                readOnly: true

    volumes:
        - name: config-volume
          configMap:
              name: my-config-file # ⚠️ ConfigMap name
```

---

### 5.3 Secret - Environment Variables

```yaml
apiVersion: v1
kind: Secret
metadata:
    name: my-secret
    namespace: my-app-dev
type: Opaque # ⚠️ Generic secret type
data: # ⚠️ Base64 encoded values
    DB_PASSWORD: cGFzc3dvcmQxMjM= # echo -n "password123" | base64
    API_KEY: c2VjcmV0a2V5MTIz

# Or use stringData (plain text, auto-encoded)
stringData: # ⚠️ Plain text (easier)
    DB_PASSWORD: password123
    API_KEY: secretkey123
```

**Use in Deployment:**

```yaml
spec:
    containers:
        - name: my-app
          image: my-app:v1

          env:
              - name: DATABASE_PASSWORD
                valueFrom:
                    secretKeyRef:
                        name: my-secret # ⚠️ Secret name
                        key: DB_PASSWORD # ⚠️ Key from Secret

          # Or all secrets as env vars
          envFrom:
              - secretRef:
                    name: my-secret
```

---

### 5.4 Secret - File Based

```yaml
apiVersion: v1
kind: Secret
metadata:
    name: tls-secret
    namespace: my-app-dev
type: kubernetes.io/tls # ⚠️ TLS secret type
data:
    tls.crt: <base64-encoded-cert>
    tls.key: <base64-encoded-key>
```

**Mount as Volume:**

```yaml
spec:
    containers:
        - name: my-app
          image: my-app:v1
          volumeMounts:
              - name: secret-volume
                mountPath: /etc/ssl/certs # ⚠️ Where files appear
                readOnly: true

    volumes:
        - name: secret-volume
          secret:
              secretName: tls-secret # ⚠️ Secret name
```

---

### Quick Commands

```bash
# Create ConfigMap from literal
kubectl create configmap my-config \
  --from-literal=KEY1=value1 \
  --from-literal=KEY2=value2 \
  -n my-app-dev

# Create ConfigMap from file
kubectl create configmap my-config \
  --from-file=config.properties \
  -n my-app-dev

# Create Secret from literal
kubectl create secret generic my-secret \
  --from-literal=password=secret123 \
  -n my-app-dev

# Create Secret from file
kubectl create secret generic my-secret \
  --from-file=credentials.json \
  -n my-app-dev

# Create TLS Secret
kubectl create secret tls tls-secret \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  -n my-app-dev

# View ConfigMap
kubectl get configmap my-config -o yaml -n my-app-dev

# View Secret (decoded)
kubectl get secret my-secret -o jsonpath='{.data.password}' | base64 -d
```

### ⚠️ Consequences of Wrong Configuration

| Mistake                                 | Consequence                                      |
| --------------------------------------- | ------------------------------------------------ |
| Wrong ConfigMap/Secret name in pod      | Pod fails to start, `CreateContainerConfigError` |
| Wrong key name                          | Env var not set or file missing                  |
| Secret not base64 encoded (in `data`)   | Invalid secret, pod error                        |
| ConfigMap/Secret in different namespace | Not found, pod fails                             |
| Updating ConfigMap (env-based)          | **Pods don't auto-update**, need restart         |
| Updating ConfigMap (volume-based)       | Auto-updates (with delay), no restart needed     |

### 📚 Documentation

- https://kubernetes.io/docs/concepts/configuration/configmap/
- https://kubernetes.io/docs/concepts/configuration/secret/

---

## 6. 🚪 INGRESS

### Definition

> **HTTP/HTTPS router** that routes external traffic to your services based on hostname or path. Think of it as a **smart reverse proxy** with SSL termination.

> ⚠️ **Requires an Ingress Controller** (nginx, traefik, etc.) installed in cluster!

### YAML Template

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
    name: my-ingress
    namespace: my-app-dev
    annotations: # ⚠️ Controller-specific settings
        # For NGINX Ingress Controller
        nginx.ingress.kubernetes.io/rewrite-target: /
        nginx.ingress.kubernetes.io/ssl-redirect: 'true'

        # Rate limiting
        nginx.ingress.kubernetes.io/limit-rps: '10'

        # For cert-manager (auto TLS)
        cert-manager.io/cluster-issuer: 'letsencrypt-prod'

spec:
    ingressClassName: nginx # ⚠️ IMPORTANT: Which controller to use

    tls: # ⚠️ HTTPS configuration
        - hosts:
              - myapp.example.com
              - api.example.com
          secretName: tls-secret # ⚠️ TLS cert secret

    rules:
        # Host-based routing
        - host: myapp.example.com # ⚠️ IMPORTANT: Domain name
          http:
              paths:
                  - path: / # ⚠️ URL path
                    pathType: Prefix # Prefix | Exact | ImplementationSpecific
                    backend:
                        service:
                            name: frontend-service # ⚠️ CRITICAL: Service name
                            port:
                                number: 80 # ⚠️ CRITICAL: Service port

        # Path-based routing
        - host: api.example.com
          http:
              paths:
                  - path: /v1
                    pathType: Prefix
                    backend:
                        service:
                            name: api-v1-service
                            port:
                                number: 80

                  - path: /v2
                    pathType: Prefix
                    backend:
                        service:
                            name: api-v2-service
                            port:
                                number: 80
```

### Quick Commands

```bash
# Install NGINX Ingress Controller (if not installed)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Create ingress
kubectl apply -f ingress.yaml

# List ingresses
kubectl get ingress -n my-app-dev

# Describe ingress
kubectl describe ingress my-ingress -n my-app-dev

# Get ingress controller external IP
kubectl get svc -n ingress-nginx

# Delete ingress
kubectl delete ingress my-ingress -n my-app-dev
```

### ⚠️ Consequences of Wrong Configuration

| Mistake                         | Consequence                   |
| ------------------------------- | ----------------------------- |
| No Ingress Controller installed | Ingress does nothing          |
| Wrong `ingressClassName`        | Ingress ignored by controller |
| Wrong service name              | 502 Bad Gateway               |
| Wrong service port              | 502 Bad Gateway               |
| Service in different namespace  | Not found, 503 error          |
| Wrong TLS secret name           | HTTPS fails, SSL error        |
| Invalid host (no DNS)           | Cannot reach the site         |

### 📚 Documentation

- https://kubernetes.io/docs/concepts/services-networking/ingress/
- https://kubernetes.github.io/ingress-nginx/

---

## 7. ⎈ HELM

### Definition

> **Package manager for Kubernetes** - like apt/yum for Linux. Uses **Charts** (pre-configured templates) to install complex applications. Think of it as **installing apps with one command**.

### Directory Structure

```
my-chart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default configuration
├── charts/             # Dependencies
└── templates/          # Kubernetes YAML templates
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── configmap.yaml
    ├── _helpers.tpl    # Template helpers
    └── NOTES.txt       # Post-install notes
```

### Chart.yaml

```yaml
apiVersion: v2 # ⚠️ v2 for Helm 3
name: my-app # ⚠️ IMPORTANT: Chart name
description: My application chart
type: application # application | library
version: 1.0.0 # ⚠️ IMPORTANT: Chart version
appVersion: '1.0.0' # App version (displayed)

dependencies: # Optional: Sub-charts
    - name: postgresql
      version: '12.1.0'
      repository: 'https://charts.bitnami.com/bitnami'
      condition: postgresql.enabled
```

### values.yaml

```yaml
# ⚠️ These values can be overridden during install
replicaCount: 3

image:
    repository: nginx
    tag: '1.21'
    pullPolicy: IfNotPresent

service:
    type: ClusterIP
    port: 80

ingress:
    enabled: true
    className: nginx
    host: myapp.example.com

resources:
    limits:
        cpu: 500m
        memory: 128Mi
    requests:
        cpu: 250m
        memory: 64Mi

# Feature flags
postgresql:
    enabled: true
```

### templates/deployment.yaml (Example)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: { { include "my-app.fullname" . } } # ⚠️ Helm templating
    labels: { { - include "my-app.labels" . | nindent 4 } }
spec:
    replicas: { { .Values.replicaCount } } # ⚠️ From values.yaml
    selector:
        matchLabels: { { - include "my-app.selectorLabels" . | nindent 6 } }
    template:
        metadata:
            labels: { { - include "my-app.selectorLabels" . | nindent 8 } }
        spec:
            containers:
                - name: { { .Chart.Name } }
                  image: '{{ .Values.image.repository }}:{{ .Values.image.tag }}'
                  imagePullPolicy: { { .Values.image.pullPolicy } }
                  ports:
                      - containerPort: 80
                  resources: { { - toYaml .Values.resources | nindent 12 } }
```

### Quick Commands

```bash
# ===== REPO MANAGEMENT =====
# Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update repositories
helm repo update

# Search charts
helm search repo nginx

# ===== INSTALL/UPGRADE =====
# Install chart
helm install my-release bitnami/nginx -n my-namespace

# Install with custom values
helm install my-release bitnami/nginx \
  -f custom-values.yaml \
  -n my-namespace

# Install with inline values
helm install my-release bitnami/nginx \
  --set replicaCount=3 \
  --set service.type=LoadBalancer \
  -n my-namespace

# Upgrade release
helm upgrade my-release bitnami/nginx \
  -f updated-values.yaml \
  -n my-namespace

# Install or upgrade (if exists)
helm upgrade --install my-release bitnami/nginx \
  -f values.yaml \
  -n my-namespace

# ===== INSPECT =====
# List releases
helm list -n my-namespace

# Get release status
helm status my-release -n my-namespace

# Get values used
helm get values my-release -n my-namespace

# Get all manifests
helm get manifest my-release -n my-namespace

# Show chart values
helm show values bitnami/nginx

# ===== ROLLBACK =====
# List history
helm history my-release -n my-namespace

# Rollback to previous
helm rollback my-release -n my-namespace

# Rollback to specific revision
helm rollback my-release 2 -n my-namespace

# ===== DELETE =====
# Uninstall
helm uninstall my-release -n my-namespace

# ===== DEVELOPMENT =====
# Create new chart
helm create my-chart

# Lint chart
helm lint ./my-chart

# Dry-run (preview what will be created)
helm install my-release ./my-chart --dry-run --debug

# Template locally (see rendered YAML)
helm template my-release ./my-chart -f values.yaml
```

### ⚠️ Consequences of Wrong Configuration

| Mistake                  | Consequence                          |
| ------------------------ | ------------------------------------ |
| Wrong values.yaml syntax | Helm install fails                   |
| Template syntax error    | `helm install` fails with error      |
| Missing required values  | Empty/null values, app misconfigured |
| Wrong chart version      | Incompatible features, errors        |
| No `--namespace` flag    | Installs in default namespace        |
| Deleting release         | All resources deleted                |

### 📚 Documentation

- https://helm.sh/docs/
- https://artifacthub.io/ (Find charts)

---

## 8. 🔧 KUSTOMIZE

### Definition

> **Kustomize** lets you customize Kubernetes YAML files **without modifying the originals**.
> You define a "base" configuration and then create "overlays" that patch specific values for different environments.

**The Problem It Solves:**

Without Kustomize, you'd either:

1. Copy-paste YAML files for each environment (dev, staging, prod) → maintenance nightmare
2. Use complex templating with placeholders → harder to read and validate

**Kustomize Approach:**

```
Base YAML (shared)     +     Overlay (env-specific patches)     =     Final YAML
───────────────────          ────────────────────────────            ────────────
replicas: 1                  replicas: 5                             replicas: 5
image: app:latest            image: app:v1.2.3                       image: app:v1.2.3
memory: 64Mi                 memory: 512Mi                           memory: 512Mi
```

**Key Concepts:**

| Term              | Meaning                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| **Base**          | Original YAML files - the "template" that's shared across environments               |
| **Overlay**       | Environment-specific folder that references base and applies patches                 |
| **Patch**         | A partial YAML that specifies only what to change                                    |
| **Kustomization** | The `kustomization.yaml` file that tells Kustomize what to include and how to modify |

**How it works mentally:**

```
1. Start with base/deployment.yaml (replicas: 1)
2. Apply overlays/prod/patch.yaml (replicas: 5)
3. Kustomize MERGES them → final deployment has replicas: 5
4. Everything else from base stays unchanged
```

**Real-world analogy:**
Like a restaurant franchise - there's a base menu (same across all locations), but each location can add local specials or adjust prices (overlays) without rewriting the entire menu.

### Directory Structure

```
my-app/
├── base/                       # ⚠️ Base configuration (shared)
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
│
└── overlays/                   # ⚠️ Environment-specific changes
    ├── dev/
    │   ├── kustomization.yaml
    │   ├── replica-patch.yaml
    │   └── configmap.yaml
    │
    ├── staging/
    │   ├── kustomization.yaml
    │   └── namespace.yaml
    │
    └── prod/
        ├── kustomization.yaml
        ├── replica-patch.yaml
        └── resources-patch.yaml
```

### base/kustomization.yaml

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

# ⚠️ Resources to include
resources:
    - deployment.yaml
    - service.yaml
    - configmap.yaml

# Common labels added to all resources
commonLabels:
    app: my-app

# Common annotations
commonAnnotations:
    managed-by: kustomize
# Namespace (optional in base)
# namespace: my-app
```

### base/deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: my-app
spec:
    replicas: 1 # Base replica count
    selector:
        matchLabels:
            app: my-app
    template:
        metadata:
            labels:
                app: my-app
        spec:
            containers:
                - name: my-app
                  image: my-app:latest
                  ports:
                      - containerPort: 80
                  resources:
                      requests:
                          memory: '64Mi'
                          cpu: '100m'
```

### overlays/prod/kustomization.yaml

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

# ⚠️ Reference base configuration
resources:
    - ../../base

# ⚠️ Set namespace for all resources
namespace: production

# ⚠️ Prefix/Suffix for resource names
namePrefix: prod-
# nameSuffix: -v1

# ⚠️ Image overrides
images:
    - name: my-app
      newName: my-registry/my-app
      newTag: v1.2.3

# ⚠️ Patches to modify resources
patches:
    # Inline patch
    - patch: |-
          - op: replace
            path: /spec/replicas
            value: 5
      target:
          kind: Deployment
          name: my-app

    # File-based patch
    - path: resources-patch.yaml
      target:
          kind: Deployment
          name: my-app

# ⚠️ Strategic merge patch
patchesStrategicMerge:
    - replica-patch.yaml

# ⚠️ ConfigMap generator
configMapGenerator:
    - name: my-config
      literals:
          - ENVIRONMENT=production
          - LOG_LEVEL=warn
      files:
          - config.properties

# ⚠️ Secret generator
secretGenerator:
    - name: my-secret
      literals:
          - password=prodpassword123
```

### overlays/prod/replica-patch.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: my-app # ⚠️ Must match base resource name
spec:
    replicas: 5 # ⚠️ Override replicas
```

### overlays/prod/resources-patch.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: my-app
spec:
    template:
        spec:
            containers:
                - name: my-app # ⚠️ Must match container name
                  resources:
                      requests:
                          memory: '256Mi'
                          cpu: '500m'
                      limits:
                          memory: '512Mi'
                          cpu: '1000m'
```

### Quick Commands

```bash
# ===== BUILD & PREVIEW =====
# Build/Preview kustomization (see rendered YAML)
kubectl kustomize overlays/prod

# Or using kustomize directly
kustomize build overlays/prod

# ===== APPLY =====
# Apply kustomization
kubectl apply -k overlays/prod

# Apply with dry-run
kubectl apply -k overlays/prod --dry-run=client

# ===== DELETE =====
# Delete all resources from kustomization
kubectl delete -k overlays/prod

# ===== DEVELOPMENT =====
# Edit kustomization
kustomize edit add resource new-resource.yaml
kustomize edit set image my-app=my-app:v2.0.0
kustomize edit set namespace production

# Validate
kustomize build overlays/prod | kubectl apply --dry-run=server -f -
```

### ⚠️ Consequences of Wrong Configuration

| Mistake                    | Consequence                       |
| -------------------------- | --------------------------------- |
| Wrong path in `resources`  | `kustomize build` fails           |
| Patch target doesn't match | Patch not applied, silent failure |
| Wrong patch syntax         | Build fails                       |
| Missing base reference     | Empty output                      |
| Conflicting patches        | Unpredictable results             |

### Helm vs Kustomize Comparison

| Feature            | Helm               | Kustomize            |
| ------------------ | ------------------ | -------------------- |
| Templating         | Yes (Go templates) | No (patches only)    |
| Package management | Yes                | No                   |
| Complexity         | Higher             | Lower                |
| Learning curve     | Steeper            | Gentler              |
| Rollback           | Built-in           | Manual               |
| Best for           | Complex apps       | Environment overlays |

### 📚 Documentation

- https://kustomize.io/
- https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/

---

## 9. 🔄 ARGOCD

### Definition

> **GitOps continuous delivery** tool. Automatically syncs your Kubernetes cluster state with Git repository.
> Think of it as **automated deployment from Git** - Git is the source of truth.

### Installation (using Helm)

```bash
# Add ArgoCD Helm repo
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update

# Install ArgoCD
helm install argocd argo/argo-cd \
  --namespace argocd \
  --create-namespace \
  --set server.service.type=LoadBalancer

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d

# Access UI
kubectl get svc argocd-server -n argocd
```

---

### 9.1 Application - Helm Based

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
    name: my-app-helm
    namespace: argocd # ⚠️ Always in argocd namespace
    finalizers:
        - resources-finalizer.argocd.argoproj.io
spec:
    project: default # ⚠️ IMPORTANT: ArgoCD project

    source:
        # ===== HELM FROM GIT REPO =====
        repoURL: https://github.com/myorg/my-app.git
        targetRevision: main # ⚠️ IMPORTANT: Branch/tag/commit
        path: helm/my-chart # ⚠️ IMPORTANT: Path to chart in repo

        helm:
            # Values file from repo
            valueFiles:
                - values.yaml
                - values-prod.yaml # ⚠️ Multiple values files

            # Inline value overrides
            values: |
                replicaCount: 3
                image:
                  tag: v1.2.3

            # Or individual parameters
            parameters:
                - name: image.tag
                  value: v1.2.3
                - name: service.type
                  value: LoadBalancer

    # ===== OR HELM FROM HELM REPO =====
    # source:
    #   repoURL: https://charts.bitnami.com/bitnami
    #   chart: nginx
    #   targetRevision: 15.1.0     # Chart version
    #   helm:
    #     values: |
    #       replicaCount: 2

    destination:
        server: https://kubernetes.default.svc # ⚠️ Cluster URL
        namespace: production # ⚠️ IMPORTANT: Target namespace

    syncPolicy:
        automated: # ⚠️ Enable auto-sync
            prune: true # Delete resources not in Git
            selfHeal: true # Revert manual changes
            allowEmpty: false # Prevent sync if source is empty

        syncOptions:
            - CreateNamespace=true # Create namespace if not exists
            - PruneLast=true # Prune after sync
            - ApplyOutOfSyncOnly=true # Only apply changed resources

        retry:
            limit: 5 # Retry attempts
            backoff:
                duration: 5s
                factor: 2
                maxDuration: 3m
```

---

### 9.2 Application - Git/Kustomize Based

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
    name: my-app-kustomize
    namespace: argocd
spec:
    project: default

    source:
        repoURL: https://github.com/myorg/my-app.git
        targetRevision: main
        path: kustomize/overlays/prod # ⚠️ Path to kustomization.yaml

        # Optional: Kustomize-specific options
        kustomize:
            images: # Override images
                - my-app=my-registry/my-app:v1.2.3
            namePrefix: prod- # Add prefix
            commonLabels:
                environment: production

    destination:
        server: https://kubernetes.default.svc
        namespace: production

    syncPolicy:
        automated:
            prune: true
            selfHeal: true
        syncOptions:
            - CreateNamespace=true
```

---

### 9.3 Application - Plain YAML (Directory)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
    name: my-app-plain
    namespace: argocd
spec:
    project: default

    source:
        repoURL: https://github.com/myorg/my-app.git
        targetRevision: main
        path: kubernetes/ # ⚠️ Directory with YAML files

        directory:
            recurse: true # Include subdirectories
            exclude: '*.md' # Exclude patterns

    destination:
        server: https://kubernetes.default.svc
        namespace: production

    syncPolicy:
        automated:
            prune: true
            selfHeal: true
```

---

### 9.4 ApplicationSet (Multiple Apps)

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
    name: my-apps
    namespace: argocd
spec:
    generators:
        # Generate app for each environment
        - list:
              elements:
                  - env: dev
                    namespace: development
                    branch: develop
                  - env: staging
                    namespace: staging
                    branch: main
                  - env: prod
                    namespace: production
                    branch: main

    template:
        metadata:
            name: 'my-app-{{env}}' # ⚠️ Templated name
        spec:
            project: default
            source:
                repoURL: https://github.com/myorg/my-app.git
                targetRevision: '{{branch}}'
                path: 'kustomize/overlays/{{env}}'
            destination:
                server: https://kubernetes.default.svc
                namespace: '{{namespace}}'
            syncPolicy:
                automated:
                    prune: true
                    selfHeal: true
```

### 9.5 Multiple Sources (Helm + Values from Different Repos)

Use when your Helm chart is in one repo but values files are in another (common in GitOps setups where infra team owns charts, app team owns configs).

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
    name: my-app-multi-source
    namespace: argocd
spec:
    project: default

    # ⚠️ MULTIPLE SOURCES - requires ArgoCD 2.6+
    sources:
        # Source 1: Helm chart from Helm repository
        - repoURL: https://charts.bitnami.com/bitnami
          chart: nginx
          targetRevision: 15.1.0
          helm:
              valueFiles:
                  # ⚠️ Reference values from another source using $name
                  - $values/environments/prod/values.yaml
                  - $values/environments/prod/secrets.yaml

        # Source 2: Values files from Git repo (named "values")
        - repoURL: https://github.com/myorg/app-config.git
          targetRevision: main
          ref: values # ⚠️ This name is used as $values above

    destination:
        server: https://kubernetes.default.svc
        namespace: production

    syncPolicy:
        automated:
            prune: true
            selfHeal: true
```

**What's happening:**

1. ArgoCD fetches the Helm chart from Bitnami
2. ArgoCD fetches values files from your Git repo
3. `$values` references the source with `ref: values`
4. Helm chart is rendered using values from Git repo

---

### 9.6 Values File Locations - All Options

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
    name: my-app-values-examples
    namespace: argocd
spec:
    project: default

    source:
        repoURL: https://github.com/myorg/my-app.git
        targetRevision: main
        path: helm/my-chart

        helm:
            # ═══════════════════════════════════════════════════════
            # OPTION 1: Values file from SAME repo (relative to path)
            # ═══════════════════════════════════════════════════════
            valueFiles:
                - values.yaml # helm/my-chart/values.yaml
                - ../common/values-shared.yaml # helm/common/values-shared.yaml
                - environments/prod.yaml # helm/my-chart/environments/prod.yaml

            # ═══════════════════════════════════════════════════════
            # OPTION 2: Inline values (directly in Application spec)
            # ═══════════════════════════════════════════════════════
            values: |
                replicaCount: 3
                image:
                  repository: my-registry/my-app
                  tag: v1.2.3
                ingress:
                  enabled: true
                  host: myapp.example.com

                # Complex nested values
                resources:
                  limits:
                    cpu: 500m
                    memory: 256Mi

            # ═══════════════════════════════════════════════════════
            # OPTION 3: Individual parameters (override specific keys)
            # ═══════════════════════════════════════════════════════
            parameters:
                - name: image.tag
                  value: v1.2.3
                - name: replicaCount
                  value: '5' # ⚠️ Must be string
                - name: ingress.enabled
                  value: 'true' # ⚠️ Must be string

    destination:
        server: https://kubernetes.default.svc
        namespace: production
```

---

### 9.7 Multiple Sources - Chart from Git + External Values

Common pattern: Your team's Helm chart in Git, with environment values also in Git but different path/branch.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
    name: my-app-git-chart
    namespace: argocd
spec:
    project: default

    sources:
        # Source 1: Helm chart from Git repository
        - repoURL: https://github.com/myorg/helm-charts.git
          targetRevision: main
          path: charts/my-app # Path to Chart.yaml
          helm:
              valueFiles:
                  - values.yaml # Default values from chart repo
                  - $configRepo/prod/values.yaml # From config repo
                  - $configRepo/prod/secrets.yaml # From config repo

        # Source 2: Configuration repository
        - repoURL: https://github.com/myorg/app-configurations.git
          targetRevision: main
          ref: configRepo # ⚠️ Referenced as $configRepo above

    destination:
        server: https://kubernetes.default.svc
        namespace: production
```

---

### 9.8 Multiple Sources - Combining Kustomize + Helm

When you need to apply Kustomize patches on top of a Helm chart.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
    name: my-app-helm-kustomize
    namespace: argocd
spec:
    project: default

    sources:
        # Source 1: Base Helm chart
        - repoURL: https://charts.bitnami.com/bitnami
          chart: postgresql
          targetRevision: 12.1.0
          helm:
              releaseName: my-postgres
              valueFiles:
                  - $values/base-values.yaml

        # Source 2: Values + Kustomize patches
        - repoURL: https://github.com/myorg/db-config.git
          targetRevision: main
          ref: values

        # Source 3: Additional Kustomize resources to add
        - repoURL: https://github.com/myorg/db-config.git
          targetRevision: main
          path: additional-resources/prod # Extra ConfigMaps, Secrets, etc.

    destination:
        server: https://kubernetes.default.svc
        namespace: database
```

---

### Values Precedence (When Multiple Sources)

When the same key appears in multiple places, later values override earlier ones:

```
1. Chart's default values.yaml        (lowest priority)
2. First valueFiles entry             ↓
3. Second valueFiles entry            ↓
4. Inline 'values:' block             ↓
5. 'parameters:' entries              (highest priority)
```

**Example:**

```yaml
helm:
    valueFiles:
        - values.yaml # replicaCount: 1
        - values-prod.yaml # replicaCount: 3  ← overrides
    values: |
        replicaCount: 5         # ← overrides again
    parameters:
        - name: replicaCount
          value: '10' # ← final value = 10
```

---

### ⚠️ Multiple Sources - Common Mistakes

| Mistake                         | Error/Consequence                   |
| ------------------------------- | ----------------------------------- |
| Missing `ref:` in source        | Cannot use `$refName` in valueFiles |
| Wrong `$ref` name               | "source with ref 'xxx' not found"   |
| Using `source:` with `sources:` | Invalid spec, use one or the other  |
| ArgoCD version < 2.6            | Multiple sources not supported      |
| Wrong path in valueFiles        | Values file not found, sync fails   |

---

### Quick Commands

```bash
# ===== ARGOCD CLI =====
# Install CLI
brew install argocd  # macOS
# Or download from GitHub releases

# Login
argocd login <ARGOCD_SERVER> --username admin --password <PASSWORD>

# ===== APPLICATION MANAGEMENT =====
# List applications
argocd app list

# Get app details
argocd app get my-app

# Sync application (manual deploy)
argocd app sync my-app

# Sync with prune
argocd app sync my-app --prune

# Force sync (bypass hooks)
argocd app sync my-app --force

# Rollback
argocd app rollback my-app <REVISION>

# View app history
argocd app history my-app

# Delete application
argocd app delete my-app

# Delete app AND resources
argocd app delete my-app --cascade

# ===== USING KUBECTL =====
# Create application
kubectl apply -f application.yaml

# List applications
kubectl get applications -n argocd

# Describe application
kubectl describe application my-app -n argocd

# View sync status
kubectl get applications my-app -n argocd -o jsonpath='{.status.sync.status}'
```

### ⚠️ Consequences of Wrong Configuration

| Mistake                               | Consequence                        |
| ------------------------------------- | ---------------------------------- |
| Wrong `repoURL`                       | Sync fails, can't access repo      |
| Wrong `path`                          | "path does not exist" error        |
| Wrong `targetRevision`                | Deploys wrong version              |
| `prune: true` accidentally            | Deletes resources not in Git       |
| `selfHeal: true` + manual changes     | Changes reverted automatically     |
| Wrong destination namespace           | Resources in wrong namespace       |
| No `CreateNamespace=true`             | Fails if namespace doesn't exist   |
| Deleting Application with `--cascade` | **Deletes all deployed resources** |

### ArgoCD Sync States

| Status      | Meaning                  |
| ----------- | ------------------------ |
| Synced      | Cluster matches Git      |
| OutOfSync   | Cluster differs from Git |
| Unknown     | Can't determine state    |
| Progressing | Sync in progress         |
| Degraded    | Resources unhealthy      |

### 📚 Documentation

- https://argo-cd.readthedocs.io/
- https://github.com/argoproj/argo-cd

---

## 🎯 Quick Reference Card

### Resource Creation Order

```
1. Namespace
2. ConfigMaps/Secrets
3. Deployments
4. Services
5. Ingress
```

### Essential Commands

```bash
# Get all resources
kubectl get all -n <namespace>

# Watch resources
kubectl get pods -w -n <namespace>

# Debug pod
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace>
kubectl exec -it <pod-name> -n <namespace> -- /bin/sh

# Apply all YAML in directory
kubectl apply -f ./manifests/ -n <namespace>

# Delete all resources
kubectl delete all --all -n <namespace>
```

### Most Common Errors & Fixes

| Error                        | Cause                    | Fix                             |
| ---------------------------- | ------------------------ | ------------------------------- |
| `ImagePullBackOff`           | Wrong image name/tag     | Check image name, registry auth |
| `CrashLoopBackOff`           | App crashing             | Check logs: `kubectl logs`      |
| `Pending` (Pod)              | No resources/scheduling  | Check events, node resources    |
| `CreateContainerConfigError` | Missing ConfigMap/Secret | Create missing ConfigMap/Secret |
| `Connection refused`         | Wrong port/service       | Check ports, service selector   |
| `502 Bad Gateway`            | Service can't reach pod  | Check selectors, endpoints      |

---

## 📚 All Documentation Links

| Resource        | Link                                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| Kubernetes Docs | https://kubernetes.io/docs/                                                   |
| Namespace       | https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/ |
| Pods            | https://kubernetes.io/docs/concepts/workloads/pods/                           |
| Deployments     | https://kubernetes.io/docs/concepts/workloads/controllers/deployment/         |
| Services        | https://kubernetes.io/docs/concepts/services-networking/service/              |
| ConfigMaps      | https://kubernetes.io/docs/concepts/configuration/configmap/                  |
| Secrets         | https://kubernetes.io/docs/concepts/configuration/secret/                     |
| Ingress         | https://kubernetes.io/docs/concepts/services-networking/ingress/              |
| Helm            | https://helm.sh/docs/                                                         |
| Helm Charts Hub | https://artifacthub.io/                                                       |
| Kustomize       | https://kustomize.io/                                                         |
| ArgoCD          | https://argo-cd.readthedocs.io/                                               |
