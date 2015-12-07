'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var scrollIntoView = require('dom-scroll-into-view');

function isServer() {
    return !(typeof window != 'undefined' && window.document);
}
var Loader = null;
if (!isServer()) {
    Loader = require('halogen/ClipLoader');
}

var Autocomplete = React.createClass({
    displayName: 'Autocomplete',

    propTypes: {
        initialValue: React.PropTypes.any,
        onChange: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        shouldItemRender: React.PropTypes.func,
        renderItem: React.PropTypes.func.isRequired,
        menuStyle: React.PropTypes.object,
        wrapperProps: React.PropTypes.object,
        wrapperStyle: React.PropTypes.object,
        minInput: React.PropTypes.any,
        autoSelect: React.PropTypes.any,
        inputProps: React.PropTypes.object,
        findObject: React.PropTypes.func
    },

    getDefaultProps: function getDefaultProps() {
        return {
            wrapperProps: {},
            wrapperStyle: {
                display: 'inline-block'
            },
            inputProps: {},
            minInput: 0,
            autoSelect: false,
            onBlur: function onBlur() {},
            onChange: function onChange() {},
            onSelect: function onSelect(value, item) {},
            renderMenu: function renderMenu(items, value) {

                return React.createElement('div', { style: _extends({}, this.menuStyle), children: items });
            },
            shouldItemRender: function shouldItemRender() {
                return true;
            },
            menuStyle: {
                borderRadius: '3px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '2px 0',
                fontSize: '90%',
                position: 'fixed',
                overflow: 'auto',
                maxHeight: '50%' // TODO: don't cheat, let it flow to the bottom
            }
        };
    },

    getInitialState: function getInitialState() {

        return {
            value: this.props.initialValue || '',
            isOpen: false,
            highlightedIndex: null
        };
    },

    componentWillMount: function componentWillMount() {

        this._ignoreBlur = false;
        this._performAutoCompleteOnUpdate = false;
        this._performAutoCompleteOnKeyUp = false;
        var items = this.getFilteredItems(this.props.items || [], this.state.value);

        this.setState({
            items: items,
            itemsLength: items.length
        });
        //this.state.items = this.props.options;
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this._performAutoCompleteOnUpdate = true;
        console.log('will receive');
        var items = this.getFilteredItems(nextProps.items || [], this.state.value);
        this.setState({
            items: items,
            itemsLength: items.length
        });
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        if (this.state.isOpen && this._performAutoCompleteOnUpdate) {
            this._performAutoCompleteOnUpdate = false;
            this.maybeAutoCompleteText();
        }
        this.maybeScrollItemIntoView();
    },

    maybeScrollItemIntoView: function maybeScrollItemIntoView() {
        if (this.state.isOpen === true && this.state.highlightedIndex !== null) {
            var itemNode = this.refs['item-' + this.state.highlightedIndex];
            var menuNode = this.refs.menu;
            scrollIntoView(itemNode, menuNode, { onlyScrollIfNeeded: true });
        }
    },

    handleKeyDown: function handleKeyDown(event) {
        if (this.keyDownHandlers[event.key]) this.keyDownHandlers[event.key].call(this, event);else {
            this.setState({
                highlightedIndex: null,
                isOpen: true
            });
        }
    },

    setValue: function setValue(value) {
        this.setState({
            value: value
        });
    },

    handleChange: function handleChange(event) {
        var _this = this;

        this._performAutoCompleteOnKeyUp = true;

        var item = null;
        var value = event.target.value;
        var compare = value.substr(0, value.length - 1);

        var itemsToFilter = compare === this.state.value ? this.state.items : this.props.items;
        if (value.length >= this.props.minInput && this.state.itemsLength === 0) {
            itemsToFilter = this.props.items;
        }
        if (!itemsToFilter) {
            itemsToFilter = [];
        }

        if (this.props.findObject) {
            item = this.props.findObject(itemsToFilter, value);
        }
        var items = this.getFilteredItems(itemsToFilter, event.target.value);

        this.setState({
            value: event.target.value,
            items: items,
            itemsLength: items.length
        }, function () {
            _this.props.onChange(event, _this.state.value, item);
        });
    },

    handleKeyUp: function handleKeyUp() {
        if (this._performAutoCompleteOnKeyUp) {
            this._performAutoCompleteOnKeyUp = false;
            this.maybeAutoCompleteText();
        }
    },

    keyDownHandlers: {
        ArrowDown: function ArrowDown(event) {
            event.preventDefault();
            var highlightedIndex = this.state.highlightedIndex;

            var index = highlightedIndex === null || highlightedIndex === this.state.itemsLength - 1 ? 0 : highlightedIndex + 1;
            this._performAutoCompleteOnKeyUp = true;
            this.setState({
                highlightedIndex: index,
                isOpen: true
            });
        },

        ArrowUp: function ArrowUp(event) {
            event.preventDefault();
            var highlightedIndex = this.state.highlightedIndex;

            var index = highlightedIndex === 0 || highlightedIndex === null ? this.state.itemsLength - 1 : highlightedIndex - 1;
            this._performAutoCompleteOnKeyUp = true;
            this.setState({
                highlightedIndex: index,
                isOpen: true
            });
        },

        Enter: function Enter(event) {
            var _this2 = this;

            if (this.state.isOpen === false) {
                // already selected this, do nothing
                return;
            } else if (this.state.highlightedIndex == null) {
                // hit enter after focus but before typing anything so no autocomplete attempt yet
                this.setState({
                    isOpen: false
                }, function () {
                    _this2.refs.input.select();
                });
            } else {
                var item = this.state.items[this.state.highlightedIndex];
                this.setState({
                    value: this.props.getItemValue(item),
                    isOpen: false,
                    highlightedIndex: null
                }, function () {
                    //desceleciona
                    if (_this2.props.autoSelect) {
                        _this2.refs.input.setSelectionRange(_this2.state.value.length, _this2.state.value.length);
                    }
                    _this2.props.onSelect(_this2.state.value, item);
                });
            }
        },

        Escape: function Escape(event) {
            this.setState({
                highlightedIndex: null,
                isOpen: false
            });
        }
    },

    getFilteredItems: function getFilteredItems(items, value) {
        var _this3 = this;

        //  console.log('filtering -'+Math.random());
        var result = [];
        //  var time = Date.now();
        if (value.length >= this.props.minInput) {
            result = items;

            if (this.props.shouldItemRender) {
                result = items.filter(function (item) {
                    return _this3.props.shouldItemRender(item, value);
                });
            }
            if (this.props.sortItems) {
                result.sort(function (a, b) {
                    return _this3.props.sortItems(a, b, value);
                });
            }
        }
        // console.log('filterd in = ',Date.now() - time);
        return result;
    },

    maybeAutoCompleteText: function maybeAutoCompleteText() {
        var _this4 = this;

        if (!this.props.autoSelect) {
            return;
        }
        if (this.state.value === '' || this.state.value.length < this.props.minInput) return;
        var highlightedIndex = this.state.highlightedIndex;

        var items = this.state.items;

        if (items.length === 0) return;
        var matchedItem = highlightedIndex !== null ? items[highlightedIndex] : items[0];
        var itemValue = this.props.getItemValue(matchedItem);
        var itemValueDoesMatch = itemValue.toLowerCase().indexOf(this.state.value.toLowerCase()) === 0;
        if (itemValueDoesMatch) {
            var node = this.refs.input;
            var setSelection = function setSelection() {
                node.value = itemValue;
                node.setSelectionRange(_this4.state.value.length, itemValue.length);
            };

            if (highlightedIndex === null) this.setState({ highlightedIndex: 0 }, setSelection);else setSelection();
        }
    },

    highlightItemFromMouse: function highlightItemFromMouse(index) {
        this.setState({ highlightedIndex: index });
    },

    selectItemFromMouse: function selectItemFromMouse(item) {
        var _this5 = this;

        this.setState({
            value: this.props.getItemValue(item),
            isOpen: false,
            highlightedIndex: null
        }, function () {
            _this5.props.onSelect(_this5.state.value, item);
            _this5.refs.input.focus();
            _this5.setIgnoreBlur(false);
        });
    },

    setIgnoreBlur: function setIgnoreBlur(ignore) {
        this._ignoreBlur = ignore;
    },

    renderMenu: function renderMenu() {
        var _this6 = this;

        var items = this.state.items.map(function (item, index) {
            var element = _this6.props.renderItem(item, _this6.state.highlightedIndex === index, { cursor: 'default' });
            return React.cloneElement(element, {
                onMouseDown: function onMouseDown() {
                    return _this6.setIgnoreBlur(true);
                },
                onMouseEnter: function onMouseEnter() {
                    return _this6.highlightItemFromMouse(index);
                },
                onClick: function onClick() {
                    return _this6.selectItemFromMouse(item);
                },
                ref: 'item-' + index
            });
        });
        var menu = this.props.renderMenu(items, this.state.value);
        return React.cloneElement(menu, { ref: 'menu' });
    },

    handleInputBlur: function handleInputBlur(event) {
        var _this7 = this;

        if (this._ignoreBlur) return;
        this.setState({
            isOpen: false,
            highlightedIndex: null
        }, function () {
            var item = null;
            if (_this7.props.findObject) {
                item = _this7.props.findObject(_this7.state.items, _this7.state.value);
            }
            _this7.props.onBlur(event, _this7.state.value, item);
        });
    },

    handleInputFocus: function handleInputFocus() {

        if (this._ignoreBlur) return;
        if (!this.state.isOpen) {

            this.setState({ isOpen: true });
        }
    },

    handleInputClick: function handleInputClick() {

        if (!this.state.isOpen) {

            this.setState({ isOpen: true });
        }
    },

    render: function render() {
        var _this8 = this;

        var wrapperStyle = this.props.wrapperStyle;
        wrapperStyle.display = 'table';
        return React.createElement(
            'div',
            _extends({}, this.props.wrapperProps, { style: _extends({}, wrapperStyle) }),
            React.createElement('input', _extends({}, this.props.inputProps, {
                //  style={Object.assign(this.props.inputProps.style,{display:'inline-block'})}
                role: 'combobox',
                'aria-autocomplete': 'both',
                ref: 'input',
                onFocus: this.handleInputFocus,
                onBlur: function (event) {
                    return _this8.handleInputBlur(event);
                },
                onChange: function (event) {
                    return _this8.handleChange(event);
                },
                onKeyDown: function (event) {
                    return _this8.handleKeyDown(event);
                },
                onKeyUp: function (event) {
                    return _this8.handleKeyUp(event);
                },
                onClick: this.handleInputClick,
                value: this.state.value
            })),
            this.state.isOpen && !!this.state.itemsLength && this.renderMenu(),
            React.createElement(
                'span',
                { style: { position: 'relative', display: 'table-cell' } },
                React.createElement(
                    'div',
                    { style: {
                            position: 'absolute',
                            left: '-55px', top: '6px',
                            padding: '0px',
                            width: '30x',
                            height: '30px',
                            zIndex: '10'

                        } },
                    !isServer() && this.props.isLoading ? React.createElement(Loader, { color: '#26A65B', size: '22px' }) : null
                )
            )
        );
    }
});

module.exports = Autocomplete;
/*this.state.isOpen && this.renderMenu()*/