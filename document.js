if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

// Provide jQuery with an outerHtml method. Because it should already have one!
//(function($) {
//  $.fn.outerHTML = function() {
//    return $(this).clone().wrap('<div></div>').parent().html();
//  }
//})(jQuery);
//
// Turns out Redactor offers a helper for outerHtml already: this.outerHTML(element)

// Build our document JSON string. This is similiar to what we'd receive from Rails after an ajax call
var documents_json = '[
{"id":1,"name":"Document 1","file":"Document_1.docx"}, 
{"id":2,"name":"Document 2","file":"Document_2.docx"}, 
{"id":3,"name":"Document 3","file":"Document_3.docx"}]'

var documents = $.parseJSON(documents_json);

// Build our modal box
var document_modal = $("<div />",{
	"id": "mymodal"
});

var document_modal_content = $("<div />", {
	"id": "redactor_modal_content"
});

var document_modal_footer = $("<div />", {
	"id": "redactor_modal_footer"
});

var document_list = $("<select />",{
	"name": "document_list",
	"id": "documents_list"
});

$.each(documents, function(index, document){
	document_list.append($("<option />",{
		"value": document.id,
		"data-src": document.file,
		"data-title": document.name,
		"html": document.name
	}));	
});

document_list.appendTo(document_modal_content);

$("<button />",{
	"class": "redactor_modal_btn",
	"id": "mymodal-link",
	"html": "Insert"
}).wrap("<p />").appendTo(document_modal_content);

$("<a />", {
	"href": "#",
	"class": "redactor_modal_btn redactor_btn_modal_close",
	"html": "Close"
}).appendTo(document_modal_footer);

document_modal.append(document_modal_content).append(document_modal_footer);

// Now the actual Redactor plugin
RedactorPlugins.document = {

	init: function(){
	
		var $redactor = this;
		
		// Modal's callback
		var callback = $.proxy(function(){
			this.saveSelection();
			$('#redactor_modal #mymodal-link').click($.proxy(function(){
				this.insertFromMyModal();	
				return false;
			}, this));
		}, this);
		
		this.addBtnAfter('link', 'document', 'Document', function(redactor_object, event, button_key){
			redactor_object.modalInit('Insert Document', $redactor.outerHTML(document_modal), 500, callback);
		});
		this.addBtnSeparatorBefore('document');
	},
	
	insertFromMyModal: function(){
		this.restoreSelection();
		var selected_option = $("select#documents_list option:selected");
		this.execCommand('inserthtml', '<a href="'+selected_option.data("src")+'">'+selected_option.data("title")+'</a>');
		this.modalClose();
		//redactor_object.insertHtml('<b>It\'s awesome!</b> ');
	}

}