const mustacheRender = (templateID, containerID, data) => {
    let template = document.getElementById(templateID).innerHTML;
    Mustache.parse(template);
    let rendered = Mustache.render(template, data);
    document.getElementById(containerID).innerHTML = rendered;
};

let analysisCreatorData = {
    heading: 'Page analysis',
    formLabel: 'page url',
    buttonText: 'Analyze'
};
mustacheRender('page-analysis-creator', 'analysis-creator-container', analysisCreatorData);
let analysisReportData = {
    succeed: false,
    report: {
        errormessage: "error occurs"
    }
};

// handling the form submit
const getSettings = (url, data) => {
    let pageurl = url;
    let configs = {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    };
    if (data && data!== null && typeof data === 'object') {
        configs.body = JSON.stringify(data);
    }
    return { pageurl, configs }
};
let getUrlValidity = (url) => {
    /**
    * @TODO more condition to validate the given url
    * regular express validate the given url
    * not empty
    * should contain protocol
    */
    let isValid = true;
    let msg = '';
    let isEmpty = url.trim().length <= 0;
    let isCorrectProtocol = /^(http:|https:)\/\//.test(url);
    if ( isEmpty ) {
        isValid = false;
        msg = 'The url is empty!';
    } else {
        if (!isCorrectProtocol) {
            isValid = false;
            msg = "The url should have a correct protocol 'http:' or 'https:'!";
        }
    }
    return { isValid, msg };
};

document.getElementById("pageurl-submit").addEventListener('click', (e) => {
    e.preventDefault();
    let pageurl = document.getElementById("pageurl").value;
    let validity = getUrlValidity(pageurl);

    // if the page url is valid, send the url to server
    if (validity.isValid) {
    let settings = getSettings('/analysis', { pageurl });
    fetch(settings.pageurl, settings.configs)
        .then( res => res.json())
        .then( data => {
            mustacheRender('page-analysis-report', 'analysis-report-container', data);
        });
    } else {
        /**
        * @TODO showing error message instead of alert
        */
        alert(validity.msg);
    }
});
