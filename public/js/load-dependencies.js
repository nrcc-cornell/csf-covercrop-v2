function loadToolDependencies() {

    var dependency;
    var element = document.getElementsByTagName("body")[0]

    console.log('loading csf-covercrop-v2 css');
    dependency = document.createElement('link');
    dependency.setAttribute("rel","stylesheet");
    dependency.setAttribute("type","text/css");
    dependency.setAttribute("href", CSFTOOL_URL + "/style/csf-covercrop-v2.css?v=2.0.0");
    element.appendChild(dependency);

}
loadToolDependencies();
