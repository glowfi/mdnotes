import os


def readFile(path):
    with open(path, "r") as fp:
        data = fp.read()
    return data


def process(name, folder):

    os.system(f"touch {name}")
    os.system(f"rm {name}")
    os.system(f"echo '# Golang'>>{name}")
    os.system(f"echo '\n'>>{name}")

    for filename in os.listdir(folder):
        if filename.find("23") != -1:
            break
        else:
            _filename = f"{folder}/{filename}"
            for file in os.listdir(_filename):
                if file == "main.go":
                    try:
                        os.system(f"echo '# {filename}'>> {name}")
                        os.system(f"echo -e '\n' >> {name}")
                        os.system(f"echo '> Code'>> {name}")
                        fullPath = _filename + "/" + file
                        os.system(f"echo '```go' >> {name}")
                        os.system(f"cat {fullPath} >> {name}")
                        os.system(f"echo '```' >> {name}")
                        os.system(f"echo -e '\n' >> {name}")
                        print(filename)
                    except Exception as e:
                        print(filename, "ERROR")
                        raise e


name = "25_Golang.md"
folder = "./golang"
process(name, folder)
