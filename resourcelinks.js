if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

// Provide jQuery with an outerHtml method. Because it should already have one!
//(function($) {
//  $.fn.outerHTML = function() {
//    return $(this).clone().wrap('<div></div>').parent().html();
//  }
//})(jQuery);
//
// Turns out Redactor offers a helper for outerHtml already: this.outerHTML(element)

// Build our resource JSON string. This is similiar to what we'd receive from Rails after an ajax call
var resources_json = '[{"id":1,"name":"Document 1","file":"Document_1.docx"}, {"id":2,"name":"Document 2","file":"Document_2.docx"}, {"id":3,"name":"Document 3","file":"Document_3.docx"}]'

var resources = $.parseJSON(resources_json);

// Build our modal box
var resource_modal = $("<div />",{
	"id": "resourcemodal"
});

var resource_modal_content = $("<div />", {
	"id": "redactor_modal_content"
});

var resource_modal_footer = $("<div />", {
	"id": "redactor_modal_footer"
});

var resource_list = $("<select />",{
	"name": "resource_list",
	"id": "resources_list"
});

$.each(resources, function(index, resource){
	resource_list.append($("<option />",{
		"value": resource.id,
		"data-src": resource.file,
		"data-title": resource.name,
		"html": resource.name
	}));	
});

resource_list.appendTo(resource_modal_content);

$("<button />",{
	"class": "redactor_modal_btn",
	"id": "resourcemodal-insert",
	"html": "Insert"
}).wrap("<p />").appendTo(resource_modal_content);

$("<a />", {
	"href": "#",
	"class": "redactor_modal_btn redactor_btn_modal_close",
	"html": "Close"
}).appendTo(resource_modal_footer);

resource_modal.append(resource_modal_content).append(resource_modal_footer);

// Now the actual Redactor plugin
RedactorPlugins.resourcelinks = {

	init: function(){
		
		// Modal's callback
		var callback = $.proxy(function(){
			this.saveSelection();
			$('#redactor_modal #resourcemodal-insert').click($.proxy(function(){
				this.insertFromResourceModal();	
				return false;
			}, this));
		}, this);
		
		this.addBtnAfter('link', 'resource', 'Resource', function(redactor_object, event, button_key){
			redactor_object.modalInit('Insert Resource link', redactor_object.outerHTML(resource_modal), 500, callback);
		});
		this.addBtnSeparatorBefore('resource');
	},
	
	insertFromResourceModal: function(){
		this.restoreSelection();
		var selected_option = $("select#resources_list option:selected");
		this.execCommand('inserthtml', '<a href="'+selected_option.data("src")+'">'+selected_option.data("title")+'</a>');
		this.modalClose();
		//redactor_object.insertHtml('<b>It\'s awesome!</b> ');
	}

}