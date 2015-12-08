'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var scrollIntoView = require('dom-scroll-into-view');

function isServer() {
    return !(typeof window != 'undefined' && window.document);
}

var Loader = null;
var isIE10 = false;
if (!isServer()) {
    Loader = require('halogen/ClipLoader');
    if (navigator.appVersion.indexOf("MSIE 10") !== -1) {
        isIE10 = true;
    }
}

//default props

var Autocomplete = React.createClass({
    displayName: 'Autocomplete',

    propTypes: {
        // initialValue: React.PropTypes.any,
        value: React.PropTypes.any,
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
        findObject: React.PropTypes.func,
        chevronStyle: React.PropTypes.object

    },

    getDefaultProps: function getDefaultProps() {

        return {
            wrapperProps: {},
            inputProps: {
                //  type:'search',
                //padding:'3px',
                style: { width: '100%', height: '30px', boxSizing: 'border-box', fontSize: '12', paddingLeft: '5px', paddingRight: '22px' }
            },
            minInput: 0,
            value: '',
            readOnly: false,
            autoSelect: false,
            showChevron: true,
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
                width: 'inherit',
                left: '0',
                top: '30px',
                //  borderRadius: '3px',
                border: '1px solid black',
                background: 'white',
                //    padding: '2px 0',
                zIndex: '2',
                position: 'absolute',
                overflow: 'auto',
                maxHeight: '200px'
            },
            spinnerStyle: {
                position: 'absolute',
                left: '-6px', top: '5px',
                padding: '0px',
                width: '30x',
                height: '30px',
                zIndex: '10'
            },
            wrapperStyle: {
                position: 'relative',
                width: '100%',
                display: 'table'
            },
            chevronStyle: {
                position: 'absolute',
                left: '-20px', top: '0px',
                pointerEvents: 'none',
                // padding:'0px',
                fontSize: '18px',
                //  align:'center',
                //   width:'10px',
                //    height:'10px',
                zIndex: '2'
            }

        };
    },

    getInitialState: function getInitialState() {

        return {
            isOpen: false,
            highlightedIndex: null
        };
    },

    componentWillMount: function componentWillMount() {

        this._ignoreBlur = false;
        this._performAutoCompleteOnUpdate = false;
        this._performAutoCompleteOnKeyUp = false;
        var items = this.props.items || [];
        // var items = this.getFilteredItems(this.props.items || [],this.props.value);

        this.setState({
            items: items,
            itemsLength: items.length
        });
        //this.state.items = this.props.options;
    },

    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        // console.log(nextProps);
        // console.log(nextState);

        return nextProps.value !== this.props.value || nextState.highlightedIndex !== this.state.highlightedIndex || nextState.isOpen !== this.state.isOpen || nextState.isLoading !== this.props.isLoading;
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this._performAutoCompleteOnUpdate = true;

        /*  console.log(nextProps.value);
         console.log(this.props.value);*/
        if (this.props.items.length !== nextProps.items.length) {
            var items = this.getFilteredItems(nextProps.items || [], nextProps.value);

            this.setState({
                items: items,
                itemsLength: items.length
            });
        }
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

    /*  setValue(value) {
     this.setState({
     value
     });
     },*/

    handleChange: function handleChange(event) {
        var _this = this;

        this._performAutoCompleteOnKeyUp = true;

        var item = null;
        var value = event.target.value;
        var compare = value.substr(0, value.length - 1);

        var itemsToFilter = compare === this.props.value ? this.state.items : this.props.items;
        if (value.length >= this.props.minInput && this.state.itemsLength === 0) {
            itemsToFilter = this.props.items;
        }
        if (!itemsToFilter) {
            itemsToFilter = [];
        }

        if (this.props.findObject) {
            item = this.props.findObject(itemsToFilter, value);
        }
        var items = this.getFilteredItems(itemsToFilter, value);

        this.setState({
            items: items,
            itemsLength: items.length
            //     item
        }, function () {
            _this.doNotEventBlur = false;
            _this.props.onChange(event, value, item);
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
                var value = this.props.getItemValue(item);
                this.setState({

                    isOpen: false,
                    highlightedIndex: null
                }, function () {
                    //desceleciona
                    if (_this2.props.autoSelect) {
                        _this2.refs.input.setSelectionRange(value.length, value.length);
                    }
                    _this2.props.onSelect(value, item);
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
        if (this.props.value === '' || this.props.value.length < this.props.minInput) return;
        var highlightedIndex = this.state.highlightedIndex;

        var items = this.state.items;

        if (items.length === 0) return;
        var matchedItem = highlightedIndex !== null ? items[highlightedIndex] : items[0];
        var itemValue = this.props.getItemValue(matchedItem);
        var itemValueDoesMatch = itemValue.toLowerCase().indexOf(this.props.value.toLowerCase()) === 0;
        if (itemValueDoesMatch) {
            var node = this.refs.input;
            var setSelection = function setSelection() {
                node.value = itemValue;
                node.setSelectionRange(_this4.props.value.length, itemValue.length);
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
            isOpen: false,
            highlightedIndex: null,
            item: item
        }, function () {
            _this5.props.onSelect(_this5.props.getItemValue(item), item);
            _this5.refs.input.focus();
            _this5.setIgnoreBlur(false);
            _this5.doNotEventBlur = true;
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
        var menu = this.props.renderMenu(items, this.props.value);
        return React.cloneElement(menu, { ref: 'menu' });
    },

    handleInputBlur: function handleInputBlur(event) {
        //if (this._ignoreBlur || this.doNotEventBlur)
        if (this._ignoreBlur) return;

        if (!this.doNotEventBlur) {
            var item = null;
            if (this.props.findObject) {
                item = this.props.findObject(this.state.items, event.target.value);
            }
            //  console.log('bluring');
            //   console.log(item);
            //   console.log(this.state.item);
            if (item !== this.state.item) {
                //    console.log('bluring + sending');
                this.props.onBlur(event, event.target.value, item);
            }
            this.setState({
                isOpen: false,
                highlightedIndex: null,
                item: item
            });
        }
    },

    handleInputFocus: function handleInputFocus() {

        this.doNotEventBlur = false;

        if (this._ignoreBlur) return;
        if (!this.state.isOpen) {
            var items = this.props.items || [];
            //nao de update em items se quiser manter o que o usuario digitou
            this.setState({
                isOpen: true,
                items: items,
                itemsLength: items.length
            });
        }
    },

    handleInputClick: function handleInputClick() {

        if (!this.state.isOpen) {

            this.setState({ isOpen: true });
        }
    },

    render: function render() {
        var _this7 = this;

        //  console.log('rendering'+Math.random());
        return React.createElement(
            'div',
            _extends({}, this.props.wrapperProps, { style: _extends({}, this.props.wrapperStyle) }),
            React.createElement('input', _extends({}, this.props.inputProps, {
                //  style={Object.assign(this.props.inputProps.style,{display:'inline-block'})}
                role: 'combobox',
                'aria-autocomplete': 'both',
                ref: 'input',
                disabled: this.props.disabled,
                onFocus: this.handleInputFocus,
                onBlur: function (event) {
                    return _this7.handleInputBlur(event);
                },
                onChange: function (event) {
                    return _this7.handleChange(event);
                },
                onKeyDown: function (event) {
                    return _this7.handleKeyDown(event);
                },
                onKeyUp: function (event) {
                    return _this7.handleKeyUp(event);
                },
                onClick: this.handleInputClick,
                value: this.props.value
            })),
            this.state.isOpen && !!this.state.itemsLength && this.renderMenu(),
            React.createElement(
                'div',
                { style: { position: 'relative', display: 'table-cell' } },
                React.createElement(
                    'div',
                    { style: this.props.spinnerStyle },
                    !isServer() && this.props.isLoading ? React.createElement(Loader, { color: '#26A65B', size: '17px' }) : null
                ),
                this.props.showChevron && !this.props.isLoading && !isIE10 ? React.createElement(
                    'div',
                    { style: this.props.chevronStyle },
                    '▾'
                ) : null
            )
        );
    }
});

module.exports = Autocomplete;
//&& !this.props.isLoading
/*

 <div>
 &#x025BE;
 &#9662;</div>*/
/*this.state.isOpen && this.renderMenu()*/