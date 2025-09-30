class JList {

    constructor(param) {

        var self = this;

        Object.assign(this, {
            name: "JList",
            copyright: "&copy; JList",
            nameShort: "",
            headerTitle: true,
            el: "#jlist",
            limit: 10,
            db: "db.json",
            fields: [
               {"name": "Category", "field": "tags", "type": "tag"},
               {"name": "Skill levels", "field": "level", "type": "tag"},
               {"name": "Artifacts", "field": "artifacts", "type": "tag"},
               {"name": "Author", "field": "author", "type": "select"},
            ],
            searchFields: ["name", "author", "description", "tags", "level"]
        }, param);

        this.currentPage = 1;
        this.totalPages  = 0;
        this.filtered    = false;

        this.init();

    }

    init() {

        let wrap = document.querySelector(this.el);
        if (!wrap) { wrap = document.querySelector("body").firstElementChild; }

        this.wrap = wrap;
        this.wrap.classList.add("jlist-wrap");

        this.buildHeader();
        this.buildMain();
        this.buildMenu();
        this.buildItem();

        this.copyright = this.copyright.replace("{Y}", new Date().getFullYear());

        //let footer = document.createElement("footer");
        //footer.innerHTML = this.copyright;
        //this.wrap.appendChild(footer);

        document.querySelectorAll(".title").forEach((el) => {

            el.textContent = this.name;

        });

        document.querySelectorAll(".title-short").forEach((el) => {

            el.textContent = this.nameShort;

        });

        document.addEventListener('db-loaded', () => { this.aside() });

        JList.favicon(this.nameShort);
        this.DB_load();

        window.addEventListener('scroll', () => this.handleScroll());

    }

    buildHeader() {

        let header = document.createElement("header");

        let title = this.headerTitle ? '<h1><a href="/" class="title"></a><a href="/" class="title-short"></a></h1>' : '';

        header.innerHTML = `${title}<input type="search" data-field="search" placeholder="search..." class="searchbox" /><span class="filter-toggle" data-toggle="x">filter <i></i></span>`;

        this.wrap.appendChild(header);
        this.headerEl = document.querySelector("header");

        document.querySelector(".filter-toggle").addEventListener("click", (e) => {
            this.filterToggle(e.target);
        });

    }

    buildMain() {

        let div = document.createElement("div");
        div.classList = "main";
        div.innerHTML = `<aside></aside><div class="grid-wrap"><div class="grid"></div></div><div class="item-wrap"><div class="item-inner"></div><span>&times;</span></div>`;

        this.wrap.appendChild(div);
        this.asideEl = document.querySelector("aside");
        this.gridEl  = document.querySelector(".grid");
        this.itemEl  = document.querySelector(".item-wrap");
        this.itemInr = document.querySelector(".item-inner");

        document.querySelector(".grid").addEventListener("click", (e) => {


            if (e.target.classList.contains("grid-item")) {

                let link = e.target.querySelector("a");

                if (link.href == "#" || link.href == (location.origin + location.pathname + "#")) {

                    e.preventDefault();

                    let ID = e.target.getAttribute("data-id");
                    this.single(ID);

                } else {

                    link.click();
                    return true;

                }

            }

        });

    }

    buildItem(item = false) {

        if (!this.itemReady) {

            let div = document.createElement("div");
            div.classList = "item-name";
            this.itemInr.appendChild(div);

        }

        document.querySelector(".item-wrap span").addEventListener("click", function() {

            document.body.classList.remove("single");
            location.hash = "home";

            return false;

        });

    }

    buildMenu() {

        if (this.menu && this.menu.length) {

            let ul = document.createElement("ul");
            ul.classList = "jlist-top-menu";

            for(let m in this.menu) {

                m = this.menu[m];

                let li = document.createElement("li");
                li.innerHTML = `<li><a href="${m.url}" target="${m.target}">${m.name}</a></li>`;

                ul.appendChild(li);

            }

            this.headerEl.appendChild(ul);

        }

    }

    buildEl(data) {

        let hint = data.hasOwnProperty("hint") ? data.hint : data.name + " filter";

        let html = `<h3>${data.name} <span class="hint-toggle">?</span><i>${hint}</i></h3>`,
        type = data.type;

        if (data.hasOwnProperty("__isGridItem")) {
            type = "item";
        }


        switch(type) {

            case "category":

                html+= `<div class="filter tag-list category-list category--${data.field}" data-field="${data.field}">`;

                for(let nn in this.fieldValues[data.field]) {

                    let text = this.fieldValues[data.field][nn];
                    html+=`<div class="tag--item category--item">${text}</div>`

                }

                html+= `</div>`

                break;

            case "tag":

                html+= `<div class="filter tag-list tag--${data.field}" data-field="${data.field}">`;

                for(let nn in this.fieldValues[data.field]) {

                    let text = this.fieldValues[data.field][nn];
                    html+=`<div class="tag--item">${text}</div>`

                }

                html+= `</div>`

                break;

            case "select":

                html+= `<div class="filter select-list select--${data.field}"><select class="filter-item" data-field="${data.field}" name="${data.field}"><option value="">All</option>`;

                    for(let nn in this.fieldValues[data.field]) {

                        let text = this.fieldValues[data.field][nn],
                        val = text.replace(/"/g, '\\"');

                        html+=`<option value="${val}">${text}</option>`

                    }

                html+= `</select></div>`
                break;

            case "item":

                let img = this.getImage(data),
                link    = data.hasOwnProperty("permalink") ? data.permalink : "#",
                target  = link == "#"  ? "" : "";

                console.log(link);

                if (link && link.substring(0,1)=="/") {
                    link = location.pathname + (link.substring(1));
                }

                html = `<a href="${link}" ${target}>
                            <div><img src="`+img+`"/></div>
                            <div><h4>${data.author}</h4></div>
                            <div><h2>${data.name}</h2></div>
                            <div class="descr">${data.description}</div>
                        </a>`;

                break;


        }

        return html;

    }

    static favicon(textIn = '', background = '#ffffff', color = '#333333') {

        if (!textIn) { textIn = this.name.substring(0,1); }

        const text    = String(textIn).substring(0, 3).toUpperCase();
        const canvas  = document.createElement('canvas');
        const size    = 64;
        canvas.width  = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');

        ctx.fillStyle = background;
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle    = color;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';


        const fontSize = text.length === 1 ? 48 : 36;
        ctx.font = `bold ${fontSize}px Arial`;


        ctx.fillText(text, size/2, size/2);

        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type  = 'image/png';
        link.rel   = 'shortcut icon';
        link.href  = canvas.toDataURL('image/png');

        document.head.appendChild(link);

    }

    async DB_load(url = '') {

        if (!url) { url = this.db; }

        try {

            const response = await fetch(url, {
                mode: 'cors',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this._db = await response.json();

            for(let nn in this._db){

                this._db[nn].ID = Number(nn);

            }

            this.values();

            console.log('Database loaded successfully with ' + this._db.length + ' entries');
            setTimeout(() => document.dispatchEvent(new Event('db-loaded')), 500);

            this.totalPages = Math.ceil(this._db.length / this.limit);

            return true;

        } catch (error) {

            console.error('Database load failed:', error);
            this._db = null;

            throw error;

        }

    }

    lazyLoad() {

        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const loadImage = (image) => {

            const src = image.getAttribute('data-src');
            const srcset = image.getAttribute('data-srcset');

            if (src) {
                image.src = src;
            }

            if (srcset) {
                image.srcset = srcset;
            }

            image.onload = () => {

                image.removeAttribute('data-src');
                image.removeAttribute('data-srcset');
                image.classList.add("loaded");

            };

        };

        const imageObserver = new IntersectionObserver((entries, observer) => {

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });

        }, options);

        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });

    }

    values() {

        this.fieldValues = {};
        for(let field in this.fields) {

            let f = this.fields[field];

            if(f.type == "category" || f.type == "tag" || f.type == "select") {

                this.fieldValues[f.field] = [];

                for(let nn in this._db) {

                    let val = this._db[nn][f.field];

                    if (typeof val == "object") {

                        //console.log(val);

                        for(let n in val) {

                            let vval = val[n];

                            if (typeof vval == "object") {

                                vval = Object.keys(vval)[0];

                            }

                            if (!this.fieldValues[f.field].includes(vval)) {
                                this.fieldValues[f.field].push(vval);
                            }

                        }

                    } else {

                        if (!this.fieldValues[f.field].includes(val)) {
                            this.fieldValues[f.field].push(val);
                        }

                    }

                }

                this.fieldValues[f.field].sort();

            }

        }

    }

    aside() {

        let item = this._db[0],
        fieldsQty = 0, field, f, div;

        //document.querySelector(".total").textContent = this._db.length;

        this.asideEl.innerHTML = '';

        const fragment = new DocumentFragment();

        for(field in this.fields) {

            f = this.fields[field];

            if (item.hasOwnProperty(f.field)) {

                div = document.createElement("div");
                div.classList = "aside-item";
                div.innerHTML = this.buildEl(f);
                fragment.appendChild(div);

            }

            this.asideEl.appendChild(fragment);

        };

        div = document.createElement("div");
        div.classList = "aside-filter";
        div.innerHTML = '<button class="filter-ok">OK</button><button class="filter-clear">Reset</button>';
        this.asideEl.appendChild(div);


        document.querySelectorAll(".tag--item").forEach((element) => {

            element.addEventListener("click", (e) => {

                let el = e.target;

                if (el.classList.contains("active")) {
                    el.classList.remove("active");
                } else {
                    el.classList.add("active");
                }

                this.search();

            });

        });

        document.querySelectorAll("select.filter-item").forEach((element) => {

            element.addEventListener("change", (e) => {

                this.search();

            });


        });

        document.querySelectorAll(".hint-toggle").forEach((element) => {

            function hintToggle(e) {

                document.querySelectorAll("h3.hint").forEach((element) => {
                    element.classList.remove("hint");
                });

                let el = e.target;
                el.parentNode.classList.add("hint");

                setTimeout(() => {
                    el.parentNode.classList.remove("hint");
                }, 5000);

            }

            function hintToggleOff(e) {

                let el = e.target;

                setTimeout(() => {
                    el.parentNode.classList.remove("hint");
                }, 1500);

            }

            element.addEventListener("click", hintToggle);

        });

        document.querySelector(".searchbox").addEventListener("keyup", (e) => {
            this.search();
        });

        document.querySelector(".searchbox").addEventListener("input", (e) => {
            if (e.target.value === '') {
                this.search();
            }
        });

        document.querySelector(".filter-ok").addEventListener("click", (e) => {

            this.filterToggle();

        });

        document.querySelector(".filter-clear").addEventListener("click", (e) => {

            document.querySelectorAll(".tag--item.active").forEach((e) => {
                e.classList.remove("active");
            });

            document.querySelectorAll("select").forEach((e) => {
                e.value = "";
            });

            document.body.classList.remove("filtered");

            this.filterToggle();

            this.search();

        });

        document.body.addEventListener("click", (e) => {

            if (e.target.classList.contains("hint-toggle")) {

            } else {

                document.querySelectorAll("h3.hint").forEach((element) => {
                    element.classList.remove("hint");
                });

            }

        });

        this.filterRestore();
        this.search();

        if (location.hash) {

            let ID = location.hash.split(":");
            ID = Number(ID[ID.length - 1]);

            if (ID) { this.single(ID); }

        }

    }

    search() {

        let filter = {}, filtered = false;
        document.querySelectorAll(".filter").forEach((element) => {

            let fName = element.getAttribute("data-field");

            if (fName) {

                filter[fName] = [];

                element.querySelectorAll(".tag--item.active").forEach((t) => {

                    filtered = true;
                    filter[fName].push(t.textContent);

                });

            }

        });

        document.querySelectorAll(".filter-item").forEach((element) => {

            let fName = element.getAttribute("data-field");
            filter[fName] = [];

            let val = element.value;
            let selectedText = element.options[element.selectedIndex].text;

            if (val) {

                filtered = true;
                filter[fName].push(selectedText);

            }

        });

        if (filtered) {

            document.body.classList.add("filtered");

        } else {

            document.body.classList.remove("filtered");

        }

        let searchQuery = document.querySelector(".searchbox").value;
        if (searchQuery) { filter.search = searchQuery; }

        this.currentPage = 1;

        console.log(filter);



        this.results(filter);

    }

    handleScroll() {
        if (document.body.classList.contains("single")) { return false; }

        const footer = document.querySelector("footer");
        const header = this.headerEl;

        if (footer) {

            const footerRect = footer.getBoundingClientRect();
            if (footerRect.top <= window.innerHeight && this.currentPage == this.totalPages) {
                header.classList.remove('sticky');
            } else {
                header.classList.add('sticky');
            }

        }

        const footerHeight = footer ? footer.offsetHeight : 0;
        if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - footerHeight)) {
            if (this.currentPage < this.totalPages) {
                this.loadNextPage();
            }
        }
    }

    loadNextPage() {

        this.currentPage++;

        console.log("page: " + this.currentPage);
        this.results(this.currentFilter, this.currentPage);

    }

    filter(filter = "", page = 1) {

        const filteredData = this._db.filter(item => {

            const filterEntries = Object.entries(filter);

            return filterEntries.every(([field, filterValues]) => {

                if (!Array.isArray(filterValues) || filterValues.length === 0) return true;

                const itemValue = item[field];

                const isArrayFilter = Array.isArray(itemValue);
                const isObjectArrayFilter = isArrayFilter && itemValue.every(v => typeof v === 'object');

                if (isObjectArrayFilter) {
                    return filterValues.every(filterField =>
                        itemValue.some(obj => obj[filterField] && obj[filterField] !== "")
                    );
                }

                if (isArrayFilter) {
                    return itemValue.some(v => v && v !== "" && filterValues.includes(v));
                }

                return filterValues.includes(itemValue) && itemValue && itemValue !== "";

            }) && (!filter.search || (filter.hasOwnProperty("search") && Object.values(item).some(value =>
                String(value).toLowerCase().includes(filter.search.toLowerCase())
            )));

		});


		// Stable randomized ordering per current filter
		function shuffle(arr) {
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const tmp = arr[i];
				arr[i] = arr[j];
				arr[j] = tmp;
			}
			return arr;
		}

		// Build cache key for current filter
		const cacheKey = JSON.stringify(filter);

		let sortedData = [];
		if (this._sortedCacheKey === cacheKey && Array.isArray(this._sortedCacheIds)) {
			// Rebuild stable order from cached IDs intersected with filtered set
			const idToItem = {};
			for (let i = 0; i < filteredData.length; i++) {
				idToItem[filteredData[i].ID] = filteredData[i];
			}
			for (let i = 0; i < this._sortedCacheIds.length; i++) {
				const it = idToItem[this._sortedCacheIds[i]];
				if (it) { sortedData.push(it); }
			}
		} else {
			// Create new randomized, rating-grouped order and cache it
			const ratingToItems = {};
			for (let i = 0; i < filteredData.length; i++) {
				const item = filteredData[i];
				const rating = Number(item["ata-rating"]) || 0;
				if (!ratingToItems[rating]) { ratingToItems[rating] = []; }
				ratingToItems[rating].push(item);
			}

			const ratingsDesc = Object.keys(ratingToItems).map(Number).sort((a, b) => b - a);
			for (let r = 0; r < ratingsDesc.length; r++) {
				const k = ratingsDesc[r];
				const group = ratingToItems[k];
				sortedData.push(...shuffle(group));
			}

			this._sortedCacheKey = cacheKey;
			this._sortedCacheIds = sortedData.map(it => it.ID);
		}


		const totalItems   = sortedData.length;
        const itemsPerPage = this.limit;
        const totalPages   = Math.ceil(totalItems / itemsPerPage);

        page = Math.max(1, Math.min(page, totalPages));

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        this.currentFilter = filter;

		return {
			items: sortedData.slice(startIndex, endIndex),
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage
            }
        };

    }

    filterToggle(el = "") {

        if (!this.filtered) {
            document.body.classList.add("filter");
        } else {
            document.body.classList.remove("filter");
        }

        if (!el) {
            el = document.querySelector(".filter-toggle");
        }

        let text = el.innerHTML,
        toggle   = el.getAttribute("data-toggle");

        el.innerHTML = toggle;
        el.setAttribute("data-toggle", text);

        this.filtered = !this.filtered;

    }

    filterRestore() {

        let filter = {};

        try {
            filter = JSON.parse(localStorage.getItem("filter"));
        } catch(e) {}

        for(let f in filter) {

            let fWrap = document.querySelector(".filter[data-field='"+f+"']");
            if (!fWrap) { fWrap = document.querySelector("*[data-field='"+f+"']"); }


            for(let n in filter[f]) {

                let val = typeof filter[f] == "object" ? filter[f][n] : filter[f];

                if (fWrap.classList.contains("tag-list")) {

                    let el = Array.from(document.querySelectorAll(".tag--item")).find(el => el.textContent === val);
                    if (el) { el.classList.add("active"); }

                } else if (fWrap.tagName == "SELECT" || fWrap.tagName == "INPUT") {

                    if (val) { fWrap.value = val; }


                }


            }

        }

    }

    results(filter = "", page = 1) {

        try {
            localStorage.setItem("filter", JSON.stringify(filter));
        } catch(e) {}

        let query = this.filter(filter, page);
        if (page == 1) { this.gridEl.innerHTML = ''; }

        this.totalPages = query.pagination.totalPages;

        if (query.pagination.totalItems) {

            const fragment = new DocumentFragment();

            for(let nn in query.items) {

                let item = query.items[nn];
                item.__isGridItem = true;

                const div = document.createElement("div");
                div.classList  = "grid-item";
                div.innerHTML  = this.buildEl(item);
                div.setAttribute("data-id", item.ID);

                fragment.appendChild(div);

            }

            this.gridEl.appendChild(fragment);
            document.body.classList.remove("nothing");

        } else {

            this.gridEl.innerHTML = '<p>&nbsp;</p><p class="nothing">nothing found</p><p>&nbsp;</p>';
            document.body.classList.add("nothing");

        }

        this.lazyLoad();
        console.log(query);

    }

    getImage(data) {

        let img = "";
        if (!img && data.hasOwnProperty("image")) { img = data.image; }
        if (!img && data.hasOwnProperty("picture")) { img = data.picture; }

        if (this.hasOwnProperty("imgPath")) {
            img = this.imgPath + img;
        }

        return img;

    }

    single(ID) {

        document.body.classList.add("single");
        let item = this._db[ID],
        img = this.getImage(item), div, nn, fieldData;

        this.singleURL(item);
        this.itemInr.style.backgroundImage = `url(${img})`;

        for(nn in this.cardFields) {

            fieldData = this.cardFields[nn];

            if (item.hasOwnProperty(fieldData.field)) {

                let dataWrap = this.itemInr.querySelector(".item-" + fieldData.field);

                if (!dataWrap) {

                    div = document.createElement("div");
                    div.classList = "item-field item-" + fieldData.field;
                    div.innerHTML = this.singleValue(item, fieldData);
                    this.itemInr.appendChild(div);

                } else {

                    dataWrap.innerHTML = this.singleValue(item, fieldData);

                }

            }

        }

    }

    singleURL(item) {

        let url = item.name;
        url = url.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').toLowerCase();

        url+= ":" + item.ID;

        location.hash = url;

    }

    singleValue(item, f) {

        let val = item[f.field];



        if (typeof val == "object") {

            if (typeof val[0] == "object") {

                let valStr = "<ul class=\"artifacts-list\">";
                for(let nn in val) {

                    for(let n in val[nn]) {

                        valStr+="<li>" + ((val[nn][n] === true || typeof val[nn][n] == "string") ? "<span class=\"plus\">+</span>" : "<span class=\"minus\">-</span>") + n + "</li>";

                    }

                }

                valStr+="</ul>";

                val = valStr;

            } else {

                let valStr = "<ul class=\"values-list\">";
                for(let nn in val) {
                    valStr+="<li>" + val[nn] + "</li>";
                }

                valStr+="</ul>";

                val = valStr;

            }

        }

        if (f.hasOwnProperty("link")) {

            val = '<a href="'+val+'" target="_blank">' + (f.link ? f.link : val) + '</a>';

        } else {

            if (typeof val === "string") {
                val = val.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
            }

        }

        if (f.hasOwnProperty("label")) {

            val = "<label>" + f.label + "</label>" + val;

        }

        return val;

    }

    static singlePage() {

        document.querySelector(".item-image img").addEventListener("click", function(e) {

            let el = e.target;
            if (el.classList.contains("full")) {
                el.classList.remove("full");
            } else {
                el.classList.add("full");
            }

        });

    }

}