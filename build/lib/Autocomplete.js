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
        toUpper: React.PropTypes.bool,
        exact: React.PropTypes.bool,
        toUpperOnBlur: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        focusOnCreate: React.PropTypes.func,
        shouldItemRender: React.PropTypes.func,
        renderItem: React.PropTypes.func.isRequired,
        menuStyle: React.PropTypes.object,
        wrapperProps: React.PropTypes.object,
        wrapperStyle: React.PropTypes.object,
        minInput: React.PropTypes.any,
        inputProps: React.PropTypes.object,
        findObject: React.PropTypes.func,
        chevronStyle: React.PropTypes.object

    },

    getDefaultProps: function getDefaultProps() {

        return {
            wrapperProps: {},
            exact: false,
            inputProps: {
                //  type:'search',
                //padding:'3px',
                style: { width: '100%', height: '30px', boxSizing: 'border-box', fontSize: '12', paddingLeft: '5px', paddingRight: '22px' }
            },
            minInput: 0,
            toUpper: false,
            toUpperOnBlur: false,
            focusOnCreate: false,
            readOnly: false,
            showChevron: true,
            onBlur: function onBlur() {},
            onChange: function onChange() {},
            onSelect: function onSelect(value, item) {},
            renderMenu: function renderMenu(items) {
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
        var items = this.props.items || [];
        this._select = false;
        this._change = false;
        //    this._updated = false;
        this.doNotEventBlur = true;

        this.setState({
            value: this.props.value,
            items: items,
            itemsLength: items.length
        });
    },

    componentDidMount: function componentDidMount() {

        //   this.refs.input.value = this.props.value || '';
        this.refs.input.value = this.props.findLabelFromValue(this.props.value, this.props.items) || '';
        if (this.props.focusOnCreate) {
            this.refs.input.focus();
        }
    },

    /* shouldComponentUpdate (nextProps, nextState) {
         return true
         return  (nextState.highlightedIndex !== this.state.highlightedIndex) ||
             (nextState.isOpen !== this.state.isOpen) ||  (nextProps.isLoading !== this.props.isLoading) ||
             (this.props.value !== nextProps.value) || (this.props.disabled !== nextProps.disabled)
     },
    */

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {

        /*     console.log(this._change)
             console.log(this._select)
             console.log( nextProps.value)*/

        if (!this._select && !this._change) {
            //  console.log('updading value on select ='+nextProps.value);
            // this.refs.input.value = nextProps.value || '';
            this.refs.input.value = this.props.findLabelFromValue(nextProps.value, this.props.items) || '';
        }
        this._select = false;
        this._change = false;
        //    this._updated = false;

        if (this.props.items.length !== nextProps.items.length) {
            var items = this.getFilteredItems(nextProps.items || [], nextProps.value || '');
            this.setState({
                items: items,
                itemsLength: items.length
            });
        }
    },

    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        this.maybeScrollItemIntoView();
    },

    maybeScrollItemIntoView: function maybeScrollItemIntoView() {
        //todo quando usa seta para cima ou para baixo em um controle sem items da Uncaught TypeError: Cannot read property 'nodeType' of undefined
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
        this.refs.input.value = value;
    },

    setFocus: function setFocus() {
        this.refs.input.focus();
    },

    getRef: function getRef() {
        return this.refs.input;
    },

    handleChange: function handleChange(event) {
        var _this = this;

        //    this._updated = true;
        //    console.log('change');
        this._change = true;
        this.doNotEventBlur = false;
        var item = null;
        var value = event.target.value;
        //     var value =  this.props.findLabelFromValue(event.target.value,this.state.items);

        var compare = value.substr(0, value.length - 1);

        var itemsToFilter = compare === value ? this.state.items : this.props.items;
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
        }, function () {
            _this.doNotEventBlur = false;
            _this.props.onChange(event, _this.props.toUpper ? value.toUpperCase().trim() : value, item);
        });
    },

    keyDownHandlers: {
        ArrowDown: function ArrowDown(event) {
            event.preventDefault();
            var highlightedIndex = this.state.highlightedIndex;

            var index = highlightedIndex === null || highlightedIndex === this.state.itemsLength - 1 ? 0 : highlightedIndex + 1;

            this.setState({
                highlightedIndex: index,
                isOpen: true
            });
        },

        ArrowUp: function ArrowUp(event) {
            event.preventDefault();
            var highlightedIndex = this.state.highlightedIndex;

            var index = highlightedIndex === 0 || highlightedIndex === null ? this.state.itemsLength - 1 : highlightedIndex - 1;

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
                //this.refs.input.value = this.props.getItemValue(item);
                this.refs.input.value = this.props.findLabelFromValue(this.props.getItemValue(item), this.props.items);
                this.setState({
                    isOpen: false,
                    highlightedIndex: null
                });
                this.props.onSelect(value, item);
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

    highlightItemFromMouse: function highlightItemFromMouse(index) {
        this.setState({ highlightedIndex: index });
    },

    selectItemFromMouse: function selectItemFromMouse(item) {
        var _this4 = this;

        // this._updated = true;
        this.setState({
            isOpen: false,
            highlightedIndex: null,

            item: item
        }, function () {
            _this4._select = false;
            _this4.refs.input.focus();
            _this4.refs.input.value = _this4.props.getItemValue(item);
            // this.refs.input.value =  this.props.findLabelFromValue(this.props.getItemValue(item),this.props.items);

            //this.props.onSelect.bind(this,this.props.getItemValue(item), item)();
            _this4.props.onSelect(_this4.props.getItemValue(item), item);

            _this4.setIgnoreBlur(false);
            _this4.doNotEventBlur = true;
        });
    },

    setIgnoreBlur: function setIgnoreBlur(ignore) {
        this._ignoreBlur = ignore;
    },

    renderMenu: function renderMenu() {
        var _this5 = this;

        var items = this.state.items.map(function (item, index) {
            var element = _this5.props.renderItem(item, _this5.state.highlightedIndex === index, { cursor: 'default' });
            return React.cloneElement(element, {
                onMouseDown: function onMouseDown() {
                    return _this5.setIgnoreBlur(true);
                },
                onMouseEnter: function onMouseEnter() {
                    return _this5.highlightItemFromMouse(index);
                },
                onClick: function onClick() {
                    return _this5.selectItemFromMouse(item);
                },
                ref: 'item-' + index
            });
        });
        var menu = this.props.renderMenu(items);
        return React.cloneElement(menu, { ref: 'menu' });
    },

    handleInputBlur: function handleInputBlur(event) {

        this.fromBlur = true;
        if (this._ignoreBlur) return;

        this._change = true;
        //doNotEventBlur server para quando se selecionado (select) novamente o controle sem alteracao ele nao dispara o blur event denovo
        if (!this.doNotEventBlur) {
            var item = null;

            if (this.props.findObject) {
                //item = this.props.findObject(this.state.items,event.target.value);
                item = this.props.findObject(this.props.items, event.target.value);
            }

            var comp = item || event.target.value;
            if (comp !== this.state.item) {

                var value = this.props.findLabelFromValue(event.target.value, this.props.items);
                value = this.props.toUpper || this.props.toUpperOnBlur ? value.toUpperCase().trim() : value;

                //todo fazer isso ser opcional (mudar o valor do input caso value encontrado)
                this.refs.input.value = value;
                //value2  = (this.props.toUpper || this.props.toUpperOnBlur) ? event.target.value.toUpperCase().trim() : value2;

                if (this.props.exact) {
                    if (item) {
                        this.props.onBlur(event, value, item);
                    } else {

                        this.refs.input.value = '';
                        this.props.onBlur(event, '', null);
                    }
                } else {
                    this.props.onBlur(event, value, item);
                }
            } else {
                if (this.props.exact && !item) {
                    this.refs.input.value = '';
                }
            }
            this.setState({
                isOpen: false,
                highlightedIndex: null,
                item: comp
            });
        } else {
            this.setState({
                isOpen: false
            });
            this._change = false;
        }
        this._change = false;
    },

    handleInputFocus: function handleInputFocus() {
        //   this.doNotEventBlur = false;
        if (this._ignoreBlur) return;
        if (!this.state.isOpen) {
            var items = this.props.items || [];
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
        var _this6 = this;

        return React.createElement(
            'div',
            _extends({}, this.props.wrapperProps, { style: _extends({}, this.props.wrapperStyle) }),
            React.createElement('input', _extends({}, this.props.inputProps, {
                //  selectValue={this.props.value}
                role: 'combobox',
                'aria-autocomplete': 'both',
                ref: 'input',
                disabled: this.props.disabled,
                focusOnCreate: this.props.focusOnCreate,
                placeholder: this.props.placeholder,
                onFocus: this.handleInputFocus,
                onBlur: function (event) {
                    return _this6.handleInputBlur(event);
                },
                onChange: function (event) {
                    return _this6.handleChange(event);
                },
                onKeyDown: function (event) {
                    return _this6.handleKeyDown(event);
                },
                onClick: this.handleInputClick

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
/*(this.state.isOpen && this.state.itemsLength  === 0) ? 'sem resultados': null*/