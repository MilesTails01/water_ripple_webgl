export function unique_id() 
{
	const prefix	= String.fromCharCode(Math.floor(Math.random() * 26) + 97);
	const suffix	= Math.random().toString(36).substr(2, 8);
	return prefix + suffix;
}

export function htmlToElement(html) 
{
    var template 		= document.createElement('template');
    html 				= html.trim();
    template.innerHTML 	= html;
    return template.content.firstChild;
}