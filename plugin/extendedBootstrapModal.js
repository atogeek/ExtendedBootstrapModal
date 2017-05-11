/**
 * Extended Bootstrap Modal
 * @author Anthony Saugrain
 * @param string (simple modal) || object (complex modal)
 * @constructor
 */
function ExtendedBoostrapModal(params)
{
    /**
     * Construct the modal
     */
    this.init = function ()
    {
        // Properties
        this.cssPath = "plugin/extendedBootstrapModal.css";
        this.modal = '<div>';
        this.id = params.id || 'no_id';
        this.title = params.title || 'Caution';

        // Add css file
        this.addCss();

        // Create modal
        this.generateBootstrapModal();

        // Complex modal
        if (typeof params == 'object') {
            // Add a simple text
            if (params.addText) {
                this.addText(params.addText);
            }

            // Add a form
            this.addForm(params.addForm || []);
        } else { // Simple modal
            $(this.modal).append(params);
            this.CreateButton({'value': 'Fermer', 'type': 'button'});
        }

        // Auto displaying the modal
        if (typeof params.autoload == 'undefined' || params.autoload == true) {
            $('#' + this.id).modal();
        }
    };

    /**
     * Add a css file
     */
    this.addCss = function ()
    {
        $('head').append('<link rel="stylesheet" type="text/css" href="' + this.cssPath + '">');
    };

    /**
     * Generate an empty bootstrap modal template
     */
    this.generateBootstrapModal = function ()
    {
        var modal = $('' +
            '<div id="' + this.id + '" class="modal fade" id="modal-add" role="dialog">' +
                '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                            '<h4 class="modal-title">' + this.title + '</h4>' +
                        '</div>' +
                        '<form action="#" id="form_' + id + '" name="" method="get" class="form-horizontal">' +
                            '<div id="body_' + this.id + '" class="modal-body"></div>' +
                            '<div id="footer_' + this.id + '" class="modal-footer"></div>' +
                        '</form>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        // Store modal properties
        this.modal = '#body_' + this.id;
        this.footer = '#footer_' + this.id;
        this.body = '#form_' + this.id;
        this.body = '#body_' + this.id;

        // Add the modal to the view
        $('body').append(modal);

        // Prevent pressing enter
        $('form input').keydown(function(event) {
            if(event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });
    };

    /**
     * Add a simple text
     * @param data
     */
    this.addText = function (data)
    {
        $(this.modal).append(data);
    };

    /**
     * Generate html form
     * @param data
     */
    this.addForm = function (data)
    {
        $(this.form).attr('name', data.name);
        var self = this;

        // add input fields
        if(typeof data.inputs != 'undefined') {
            if (Array.isArray(data.inputs.list)) {

                // Create div container
                var div = this.createContainer(data.inputs.label);
                var divText = $('<div class="col-sm-10">');

                data.inputs.list.forEach(function (input) {
                    self.CreateInput(divText, input);
                });

                // Add data to the view
                div.append(divText);
                $(this.body).append(div);
            }
        }

        // add radio fields
        if(typeof data.radios != 'undefined') {
            if(Array.isArray(data.radios.list)) {

                // Create div container
                var div = this.createContainer(data.radios.label);
                var divRadios = $('<div class="col-sm-10">');

                var index = 0;
                data.radios.list.forEach(function(radio)
                {
                    var checked = (index == 0) ? 'checked' : '';
                    self.CreateRadio(divRadios, radio, checked);
                    index ++;
                });

                // Add data to the view
                div.append(divRadios);
                $(this.body).append(div);
            }
        }

        // add checkbox fields
        if(typeof data.checkboxs != 'undefined') {
            if(Array.isArray(data.checkboxs.list)) {

                // Create div container
                var div = this.createContainer(data.checkboxs.label);
                var divCheckboxs = $('<div class="col-sm-10">');

                var index = 0;
                data.checkboxs.list.forEach(function(checkbox)
                {
                    var checked = (index == 0) ? 'checked' : '';
                    self.CreateCheckbox(divCheckboxs, checkbox, checked);
                    index ++;
                });

                // Add data to the view
                div.append(divCheckboxs);
                $(this.body).append(div);
            }
        }

        // add select field
        if(typeof data.selects != 'undefined') {
            if(Array.isArray(data.selects.list)) {

                // Create div container
                var div = this.createContainer(data.selects.label);
                var divSelects = $('<div class="col-sm-10">');

                var index = 0;
                data.selects.list.forEach(function (select) {
                    self.CreateSelect(divSelects, select);
                    index++;
                });

                // Add data to the view
                div.append(divSelects);
                $(this.body).append(div);
            }
        }

        // add button fields
        if (Array.isArray(data.buttons)) {
            data.buttons.forEach(function (button) {
                self.CreateButton(button);
            });
        }
    };

    /**
     * Add an input to the given form
     * @param table
     * @param form
     * @param input
     * @constructor
     */
    this.CreateInput = function (div, input)
    {
        // Create the input cell
        var required = (input.required) ? 'required' : '';
        var type = (typeof input.type !== 'undefined') ? input.type : 'text';
        var pattern = (typeof input.pattern !== 'undefined') ? 'pattern="' + input.pattern + '"' : '';

        // Text input
        var text = $("<input type='" + type + "' id='" + input.id + "' name='" + input.name + "' class='form-control'" +
            "placeholder='" + input.placeholder + "' " + required + " " + pattern + "/>");

        // Check the input's validity
        text[0].addEventListener('invalid', function (e) {
            if (text[0].validity.valueMissing) {
                e.target.setCustomValidity("The field should not be empty");
            } else if (text[0].validity.patternMismatch == true) {
                e.target.setCustomValidity(input.errorMessage);
            }
            else {
                e.target.setCustomValidity('');
                $(this.form).submit();
            }
        }, false);

        // Add data to the view
        div.append(text);
    }

    /**
     * Add a radio to the given form
     * @param div
     * @param radio
     * @param checked
     * @constructor
     */
    this.CreateRadio = function(div, radio, checked)
    {
        // Create the radio
        var label = $('<label class="radio">');
        var input = $("<input type='radio' name='" + radio.name + "' value='" + radio.value + "' " + checked + ">");
        label.append(input);
        label.append(radio.content);

        // Select the radio button when selecting the associate text
        label.click(function()
        {
            input.attr('checked', 'checked');
        });

        // Add data to the view
        div.append(label);
    };

    /**
     * Add a checkbox to the given form
     * @param div
     * @param checkbox
     * @param checked
     * @constructor
     */
    this.CreateCheckbox = function(div, checkbox, checked)
    {
        // Create the radio
        var label = $('<label class="checkbox">');
        var input = $("<input type='checkbox' name='" + checkbox.name + "'" + checked + ">");
        label.append(input);
        label.append(checkbox.content);

        // Select the radio button when selecting the associate text
        label.click(function()
        {
            input.attr('checked', 'checked');
        });

        // Add data to the view
        div.append(label);
    };

    /**
     * Add an select (dropdown list) to the given form
     * @param div
     * @param select
     * @constructor
     */
    this.CreateSelect = function (div, select)
    {
        var self = this;
        var list = $("<select id='" + select.name + "' name='" + select.name + "' class='form-control'>");

        var index = 0;
        select.options.forEach(function (option)
        {
            var selected = (option.selected == true) ? 'selected' : '';
            self.CreateOption(list, option, selected);
            index++;
        });

        // Add data to the view
        div.append(list);
    };

    /**
     * Add an option to the given dropdown list
     * @param list
     * @param option
     * @param selected
     * @constructor
     */
    this.CreateOption = function (list, option, selected)
    {
        var input = $("<option name='" + option.name + "' value='" + option.value + "' " + selected + ">");
        input.append(option.value);
        list.append(input);
    };

    /**
     * Add a button to the given form
     * @param button
     * @constructor
     */
    this.CreateButton = function (button)
    {
        // Default button style
        var style = 'btn-default';
        if (button.type == 'submit') {
            style = 'btn-primary';
        }

        // Custom style
        if (typeof button.class != 'undefined') {
            style = button.class;
        }

        // Handle action
        // No action, dismiss modal
        if (typeof button.callback == 'undefined') {
            action = "$('#" + this.id + "').modal('hide')";
        } else {
            // Handle arguments
            var arguments = '';
            if (typeof button.arguments != 'undefined') {
                if (Array.isArray(button.arguments)) {
                    arguments = "'" + button.arguments.join("','") + "'";
                }
            }

            // Add callback action
            action = button.callback + '(' + arguments + ')';
        }

        // Create button
        var button = $('<button name="' + button.name + '" type="' + button.type + '"' +
            'onclick="' + action + '" class="btn ' + style + '">' + button.value + '</button>');

        // Add button to the modal footer
        $(this.footer).append(button);
    };

    /**
     * Create a bootstrap form-control struct
     * @param text
     * @returns {*|jQuery|HTMLElement}
     */
    this.createContainer = function(text)
    {
        var div = $("<div class='form-group'>");
        var divLabel = $("<label class='col-sm-2 control-label' for=''>");
        divLabel.append(text);
        div.append(divLabel);

        return div;
    };

    // Create modal
    this.init();
}