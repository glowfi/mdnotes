// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="1_react_1_fundamentals.html"><strong aria-hidden="true">1.</strong> 1_react_1_fundamentals</a></li><li class="chapter-item expanded "><a href="2_react_2_advanced.html"><strong aria-hidden="true">2.</strong> 2_react_2_advanced</a></li><li class="chapter-item expanded "><a href="3_react_3_axios.html"><strong aria-hidden="true">3.</strong> 3_react_3_axios</a></li><li class="chapter-item expanded "><a href="4_react_4_router_dom.html"><strong aria-hidden="true">4.</strong> 4_react_4_router_dom</a></li><li class="chapter-item expanded "><a href="5_react_5_redux_tookit.html"><strong aria-hidden="true">5.</strong> 5_react_5_redux_tookit</a></li><li class="chapter-item expanded "><a href="6_node_1_fundamentals.html"><strong aria-hidden="true">6.</strong> 6_node_1_fundamentals</a></li><li class="chapter-item expanded "><a href="7_node_2_advanced.html"><strong aria-hidden="true">7.</strong> 7_node_2_advanced</a></li><li class="chapter-item expanded "><a href="8_node_3_orm.html"><strong aria-hidden="true">8.</strong> 8_node_3_orm</a></li><li class="chapter-item expanded "><a href="9_node_4_apollo_graphql_basics.html"><strong aria-hidden="true">9.</strong> 9_node_4_apollo_graphql_basics</a></li><li class="chapter-item expanded "><a href="10_node_5_typescript.html"><strong aria-hidden="true">10.</strong> 10_node_5_typescript</a></li><li class="chapter-item expanded "><a href="11_node_6_graphql_ts_orm.html"><strong aria-hidden="true">11.</strong> 11_node_6_graphql_ts_orm</a></li><li class="chapter-item expanded "><a href="12_sql.html"><strong aria-hidden="true">12.</strong> 12_sql</a></li><li class="chapter-item expanded "><a href="13_sql_alchemy.html"><strong aria-hidden="true">13.</strong> 13_sql_alchemy</a></li><li class="chapter-item expanded "><a href="14_redis.html"><strong aria-hidden="true">14.</strong> 14_redis</a></li><li class="chapter-item expanded "><a href="15_fastapi.html"><strong aria-hidden="true">15.</strong> 15_fastapi</a></li><li class="chapter-item expanded "><a href="16_react_hooks_compressed.html"><strong aria-hidden="true">16.</strong> 16_react_hooks_compressed</a></li><li class="chapter-item expanded "><a href="17_react_Typescript.html"><strong aria-hidden="true">17.</strong> 17_react_Typescript</a></li><li class="chapter-item expanded "><a href="18_next_JS_14.html"><strong aria-hidden="true">18.</strong> 18_next_JS_14</a></li><li class="chapter-item expanded "><a href="19_React+Node_JS_JWT.html"><strong aria-hidden="true">19.</strong> 19_React+Node_JS_JWT</a></li><li class="chapter-item expanded "><a href="20_Fastapi_JWT_Scratch_React.html"><strong aria-hidden="true">20.</strong> 20_Fastapi_JWT_Scratch_React</a></li><li class="chapter-item expanded "><a href="21_Mongodb.html"><strong aria-hidden="true">21.</strong> 21_Mongodb</a></li><li class="chapter-item expanded "><a href="22_TRPC.html"><strong aria-hidden="true">22.</strong> 22_TRPC</a></li><li class="chapter-item expanded "><a href="23_React_Query.html"><strong aria-hidden="true">23.</strong> 23_React_Query</a></li><li class="chapter-item expanded "><a href="24_Monorepo.html"><strong aria-hidden="true">24.</strong> 24_Monorepo</a></li><li class="chapter-item expanded "><a href="25_Golang.html"><strong aria-hidden="true">25.</strong> 25_Golang</a></li><li class="chapter-item expanded "><a href="1_Abstraction.html"><strong aria-hidden="true">26.</strong> 1_Abstraction</a></li><li class="chapter-item expanded "><a href="2_Encapsulation.html"><strong aria-hidden="true">27.</strong> 2_Encapsulation</a></li><li class="chapter-item expanded "><a href="3_Inheritance.html"><strong aria-hidden="true">28.</strong> 3_Inheritance</a></li><li class="chapter-item expanded "><a href="4_Polymorphism.html"><strong aria-hidden="true">29.</strong> 4_Polymorphism</a></li><li class="chapter-item expanded "><a href="uml.html"><strong aria-hidden="true">30.</strong> uml</a></li><li class="chapter-item expanded "><a href="1_Single_Responsibilty_Principle.html"><strong aria-hidden="true">31.</strong> 1_Single_Responsibilty_Principle</a></li><li class="chapter-item expanded "><a href="2_Open_Close_Principle.html"><strong aria-hidden="true">32.</strong> 2_Open_Close_Principle</a></li><li class="chapter-item expanded "><a href="3_Liskov_Substituition_Principle.html"><strong aria-hidden="true">33.</strong> 3_Liskov_Substituition_Principle</a></li><li class="chapter-item expanded "><a href="4_Liskov_Signature_Rule.html"><strong aria-hidden="true">34.</strong> 4_Liskov_Signature_Rule</a></li><li class="chapter-item expanded "><a href="5_Liskov_Property_Rule.html"><strong aria-hidden="true">35.</strong> 5_Liskov_Property_Rule</a></li><li class="chapter-item expanded "><a href="6_Liskov_Method_Rule.html"><strong aria-hidden="true">36.</strong> 6_Liskov_Method_Rule</a></li><li class="chapter-item expanded "><a href="7_Interface_Segregation_Principle.html"><strong aria-hidden="true">37.</strong> 7_Interface_Segregation_Principle</a></li><li class="chapter-item expanded "><a href="8_Dependency_Inversion_Principle.html"><strong aria-hidden="true">38.</strong> 8_Dependency_Inversion_Principle</a></li><li class="chapter-item expanded "><a href="1_Design_Google_Doc.html"><strong aria-hidden="true">39.</strong> 1_Design_Google_Doc</a></li><li class="chapter-item expanded "><a href="2_Strategy_Pattern.html"><strong aria-hidden="true">40.</strong> 2_Strategy_Pattern</a></li><li class="chapter-item expanded "><a href="3_Factory_Pattern.html"><strong aria-hidden="true">41.</strong> 3_Factory_Pattern</a></li><li class="chapter-item expanded "><a href="4_Singleton_Pattern.html"><strong aria-hidden="true">42.</strong> 4_Singleton_Pattern</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
