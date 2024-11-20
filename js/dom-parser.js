function parseHTML(htmlString) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        if (doc.body.firstChild && doc.body.firstChild.nodeName === "parsererror") {
            throw new Error("Parser error");
        }
        return doc.body;
    } catch (error) {
        console.error("Error parsing HTML:", error);
        return document.createElement('body');
    }
}