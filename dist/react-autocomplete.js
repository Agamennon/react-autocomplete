(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["ReactAutocomplete"] = factory(require("React"));
	else
		root["ReactAutocomplete"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	        var source = arguments[i];for (var key in source) {
	            if (Object.prototype.hasOwnProperty.call(source, key)) {
	                target[key] = source[key];
	            }
	        }
	    }return target;
	};
	
	var React = __webpack_require__(2);
	var scrollIntoView = __webpack_require__(3);
	
	function isServer() {
	    return !(typeof window != 'undefined' && window.document);
	}
	
	var Loader = null;
	var isIE10 = false;
	if (!isServer()) {
	    Loader = __webpack_require__(6);
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
	        focusOnCreate: React.PropTypes.any,
	        shouldItemRender: React.PropTypes.func,
	        renderItem: React.PropTypes.func.isRequired,
	        openOnFocus: React.PropTypes.any,
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
	            openOnFocus: true,
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
	
	        var items;
	
	        if (value) {
	            if (this.props.findObject) {
	                item = this.props.findObject(itemsToFilter, value);
	            }
	            items = this.getFilteredItems(itemsToFilter, value);
	        } else {
	            items = this.props.items;
	        }
	
	        console.log('setting items to ', item);
	        this.setState({
	            items: items,
	            item: null,
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
	                this.doNotEventBlur = true;
	                var item = this.state.items[this.state.highlightedIndex];
	                var value = this.props.getItemValue(item);
	
	                // this.refs.input.value =  this.props.findLabelFromValue(this.props.getItemValue(item),this.props.items) ;
	                this.setState({
	                    isOpen: false,
	                    highlightedIndex: null,
	                    item: item
	                });
	                if (item !== this.state.item) {
	                    this.refs.input.value = this.props.getItemValue(item);
	                    this.props.onSelect(value, item);
	                }
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
	        // this._updated = true;
	
	        /*  if (this.state.item === item) {
	              this.setState({
	                  isOpen: false,
	                  highlightedIndex: null
	              });
	          } else {
	           }*/
	        // console.log(item === this.state.item);
	        this.setState({
	            isOpen: false,
	            highlightedIndex: null,
	            item: item
	        });
	        this.doNotEventBlur = true;
	        this._select = false;
	        this.refs.input.focus();
	
	        // this.refs.input.value =  this.props.findLabelFromValue(this.props.getItemValue(item),this.props.items) ;
	        // this.refs.input.value =  this.props.findLabelFromValue(this.props.getItemValue(item),this.props.items);
	
	        //this.props.onSelect.bind(this,this.props.getItemValue(item), item)();
	        if (item !== this.state.item) {
	            this.refs.input.value = this.props.getItemValue(item);
	            this.props.onSelect(this.props.getItemValue(item), item);
	        }
	
	        this.setIgnoreBlur(false);
	    },
	
	    setIgnoreBlur: function setIgnoreBlur(ignore) {
	        this._ignoreBlur = ignore;
	    },
	
	    renderMenu: function renderMenu() {
	        var _this4 = this;
	
	        var items = this.state.items.map(function (item, index) {
	            var element = _this4.props.renderItem(item, _this4.state.highlightedIndex === index, { cursor: 'default' });
	            return React.cloneElement(element, {
	                onMouseDown: function onMouseDown() {
	                    return _this4.setIgnoreBlur(true);
	                },
	                onMouseEnter: function onMouseEnter() {
	                    return _this4.highlightItemFromMouse(index);
	                },
	                onClick: function onClick() {
	                    return _this4.selectItemFromMouse(item);
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
	                isOpen: this.props.openOnFocus,
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
	        var _this5 = this;
	
	        return React.createElement('div', _extends({}, this.props.wrapperProps, { style: _extends({}, this.props.wrapperStyle) }), React.createElement('input', _extends({}, this.props.inputProps, {
	            //  selectValue={this.props.value}
	            role: 'combobox',
	            'aria-autocomplete': 'both',
	            ref: 'input',
	            disabled: this.props.disabled,
	            focusOnCreate: this.props.focusOnCreate,
	            openOnFocus: this.props.openOnFocus,
	            placeholder: this.props.placeholder,
	            onFocus: this.handleInputFocus,
	            onBlur: function onBlur(event) {
	                return _this5.handleInputBlur(event);
	            },
	            onChange: function onChange(event) {
	                return _this5.handleChange(event);
	            },
	            onKeyDown: function onKeyDown(event) {
	                return _this5.handleKeyDown(event);
	            },
	            onClick: this.handleInputClick
	
	        })), this.state.isOpen && !!this.state.itemsLength && this.renderMenu(), React.createElement('div', { style: { position: 'relative', display: 'table-cell' } }, React.createElement('div', { style: this.props.spinnerStyle }, !isServer() && this.props.isLoading ? React.createElement(Loader, { color: '#26A65B', size: '17px' }) : null), this.props.showChevron && !this.props.isLoading && !isIE10 ? React.createElement('div', { style: this.props.chevronStyle }, '▾') : null));
	    }
	});
	
	module.exports = Autocomplete;
	//&& !this.props.isLoading
	/*

	 <div>
	 &#x025BE;
	 &#9662;</div>*/
	/*(this.state.isOpen && this.state.itemsLength  === 0) ? 'sem resultados': null*/

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(5);
	
	function scrollIntoView(elem, container, config) {
	  config = config || {};
	  // document 归一化到 window
	  if (container.nodeType === 9) {
	    container = util.getWindow(container);
	  }
	
	  var allowHorizontalScroll = config.allowHorizontalScroll;
	  var onlyScrollIfNeeded = config.onlyScrollIfNeeded;
	  var alignWithTop = config.alignWithTop;
	  var alignWithLeft = config.alignWithLeft;
	
	  allowHorizontalScroll = allowHorizontalScroll === undefined ? true : allowHorizontalScroll;
	
	  var isWin = util.isWindow(container);
	  var elemOffset = util.offset(elem);
	  var eh = util.outerHeight(elem);
	  var ew = util.outerWidth(elem);
	  var containerOffset, ch, cw, containerScroll,
	    diffTop, diffBottom, win,
	    winScroll, ww, wh;
	
	  if (isWin) {
	    win = container;
	    wh = util.height(win);
	    ww = util.width(win);
	    winScroll = {
	      left: util.scrollLeft(win),
	      top: util.scrollTop(win)
	    };
	    // elem 相对 container 可视视窗的距离
	    diffTop = {
	      left: elemOffset.left - winScroll.left,
	      top: elemOffset.top - winScroll.top
	    };
	    diffBottom = {
	      left: elemOffset.left + ew - (winScroll.left + ww),
	      top: elemOffset.top + eh - (winScroll.top + wh)
	    };
	    containerScroll = winScroll;
	  } else {
	    containerOffset = util.offset(container);
	    ch = container.clientHeight;
	    cw = container.clientWidth;
	    containerScroll = {
	      left: container.scrollLeft,
	      top: container.scrollTop
	    };
	    // elem 相对 container 可视视窗的距离
	    // 注意边框, offset 是边框到根节点
	    diffTop = {
	      left: elemOffset.left - (containerOffset.left +
	      (parseFloat(util.css(container, 'borderLeftWidth')) || 0)),
	      top: elemOffset.top - (containerOffset.top +
	      (parseFloat(util.css(container, 'borderTopWidth')) || 0))
	    };
	    diffBottom = {
	      left: elemOffset.left + ew -
	      (containerOffset.left + cw +
	      (parseFloat(util.css(container, 'borderRightWidth')) || 0)),
	      top: elemOffset.top + eh -
	      (containerOffset.top + ch +
	      (parseFloat(util.css(container, 'borderBottomWidth')) || 0))
	    };
	  }
	
	  if (diffTop.top < 0 || diffBottom.top > 0) {
	    // 强制向上
	    if (alignWithTop === true) {
	      util.scrollTop(container, containerScroll.top + diffTop.top);
	    } else if (alignWithTop === false) {
	      util.scrollTop(container, containerScroll.top + diffBottom.top);
	    } else {
	      // 自动调整
	      if (diffTop.top < 0) {
	        util.scrollTop(container, containerScroll.top + diffTop.top);
	      } else {
	        util.scrollTop(container, containerScroll.top + diffBottom.top);
	      }
	    }
	  } else {
	    if (!onlyScrollIfNeeded) {
	      alignWithTop = alignWithTop === undefined ? true : !!alignWithTop;
	      if (alignWithTop) {
	        util.scrollTop(container, containerScroll.top + diffTop.top);
	      } else {
	        util.scrollTop(container, containerScroll.top + diffBottom.top);
	      }
	    }
	  }
	
	  if (allowHorizontalScroll) {
	    if (diffTop.left < 0 || diffBottom.left > 0) {
	      // 强制向上
	      if (alignWithLeft === true) {
	        util.scrollLeft(container, containerScroll.left + diffTop.left);
	      } else if (alignWithLeft === false) {
	        util.scrollLeft(container, containerScroll.left + diffBottom.left);
	      } else {
	        // 自动调整
	        if (diffTop.left < 0) {
	          util.scrollLeft(container, containerScroll.left + diffTop.left);
	        } else {
	          util.scrollLeft(container, containerScroll.left + diffBottom.left);
	        }
	      }
	    } else {
	      if (!onlyScrollIfNeeded) {
	        alignWithLeft = alignWithLeft === undefined ? true : !!alignWithLeft;
	        if (alignWithLeft) {
	          util.scrollLeft(container, containerScroll.left + diffTop.left);
	        } else {
	          util.scrollLeft(container, containerScroll.left + diffBottom.left);
	        }
	      }
	    }
	  }
	}
	
	module.exports = scrollIntoView;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;
	
	function getClientPosition(elem) {
	  var box, x, y;
	  var doc = elem.ownerDocument;
	  var body = doc.body;
	  var docElem = doc && doc.documentElement;
	  // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式
	  box = elem.getBoundingClientRect();
	
	  // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
	  // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
	  // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin
	
	  x = box.left;
	  y = box.top;
	
	  // In IE, most of the time, 2 extra pixels are added to the top and left
	  // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
	  // IE6 standards mode, this border can be overridden by setting the
	  // document element's border to zero -- thus, we cannot rely on the
	  // offset always being 2 pixels.
	
	  // In quirks mode, the offset can be determined by querying the body's
	  // clientLeft/clientTop, but in standards mode, it is found by querying
	  // the document element's clientLeft/clientTop.  Since we already called
	  // getClientBoundingRect we have already forced a reflow, so it is not
	  // too expensive just to query them all.
	
	  // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
	  // 窗口边框标准是设 documentElement ,quirks 时设置 body
	  // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
	  // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
	  // 标准 ie 下 docElem.clientTop 就是 border-top
	  // ie7 html 即窗口边框改变不了。永远为 2
	  // 但标准 firefox/chrome/ie9 下 docElem.clientTop 是窗口边框，即使设了 border-top 也为 0
	
	  x -= docElem.clientLeft || body.clientLeft || 0;
	  y -= docElem.clientTop || body.clientTop || 0;
	
	  return {left: x, top: y};
	}
	
	function getScroll(w, top) {
	  var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
	  var method = 'scroll' + (top ? 'Top' : 'Left');
	  if (typeof ret !== 'number') {
	    var d = w.document;
	    //ie6,7,8 standard mode
	    ret = d.documentElement[method];
	    if (typeof ret !== 'number') {
	      //quirks mode
	      ret = d.body[method];
	    }
	  }
	  return ret;
	}
	
	function getScrollLeft(w) {
	  return getScroll(w);
	}
	
	function getScrollTop(w) {
	  return getScroll(w, true);
	}
	
	function getOffset(el) {
	  var pos = getClientPosition(el);
	  var doc = el.ownerDocument;
	  var w = doc.defaultView || doc.parentWindow;
	  pos.left += getScrollLeft(w);
	  pos.top += getScrollTop(w);
	  return pos;
	}
	function _getComputedStyle(elem, name, computedStyle) {
	  var val = '';
	  var d = elem.ownerDocument;
	
	  // https://github.com/kissyteam/kissy/issues/61
	  if ((computedStyle = (computedStyle || d.defaultView.getComputedStyle(elem, null)))) {
	    val = computedStyle.getPropertyValue(name) || computedStyle[name];
	  }
	
	  return val;
	}
	
	var _RE_NUM_NO_PX = new RegExp('^(' + RE_NUM + ')(?!px)[a-z%]+$', 'i');
	var RE_POS = /^(top|right|bottom|left)$/,
	  CURRENT_STYLE = 'currentStyle',
	  RUNTIME_STYLE = 'runtimeStyle',
	  LEFT = 'left',
	  PX = 'px';
	
	function _getComputedStyleIE(elem, name) {
	  // currentStyle maybe null
	  // http://msdn.microsoft.com/en-us/library/ms535231.aspx
	  var ret = elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name];
	
	  // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
	  // 一开始就处理了! CUSTOM_STYLE.height,CUSTOM_STYLE.width ,cssHook 解决@2011-08-19
	  // 在 ie 下不对，需要直接用 offset 方式
	  // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了
	
	  // From the awesome hack by Dean Edwards
	  // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
	  // If we're not dealing with a regular pixel number
	  // but a number that has a weird ending, we need to convert it to pixels
	  // exclude left right for relativity
	  if (_RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)) {
	    // Remember the original values
	    var style = elem.style,
	      left = style[LEFT],
	      rsLeft = elem[RUNTIME_STYLE][LEFT];
	
	    // prevent flashing of content
	    elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];
	
	    // Put in the new values to get a computed value out
	    style[LEFT] = name === 'fontSize' ? '1em' : (ret || 0);
	    ret = style.pixelLeft + PX;
	
	    // Revert the changed values
	    style[LEFT] = left;
	
	    elem[RUNTIME_STYLE][LEFT] = rsLeft;
	  }
	  return ret === '' ? 'auto' : ret;
	}
	
	var getComputedStyleX;
	if (typeof window !== 'undefined') {
	  getComputedStyleX = window.getComputedStyle ? _getComputedStyle : _getComputedStyleIE;
	}
	
	// 设置 elem 相对 elem.ownerDocument 的坐标
	function setOffset(elem, offset) {
	  // set position first, in-case top/left are set even on static elem
	  if (css(elem, 'position') === 'static') {
	    elem.style.position = 'relative';
	  }
	
	  var old = getOffset(elem),
	    ret = {},
	    current, key;
	
	  for (key in offset) {
	    current = parseFloat(css(elem, key)) || 0;
	    ret[key] = current + offset[key] - old[key];
	  }
	  css(elem, ret);
	}
	
	function each(arr, fn) {
	  for (var i = 0; i < arr.length; i++) {
	    fn(arr[i]);
	  }
	}
	
	function isBorderBoxFn(elem) {
	  return getComputedStyleX(elem, 'boxSizing') === 'border-box';
	}
	
	var BOX_MODELS = ['margin', 'border', 'padding'],
	  CONTENT_INDEX = -1,
	  PADDING_INDEX = 2,
	  BORDER_INDEX = 1,
	  MARGIN_INDEX = 0;
	
	function swap(elem, options, callback) {
	  var old = {},
	    style = elem.style,
	    name;
	
	  // Remember the old values, and insert the new ones
	  for (name in options) {
	    old[name] = style[name];
	    style[name] = options[name];
	  }
	
	  callback.call(elem);
	
	  // Revert the old values
	  for (name in options) {
	    style[name] = old[name];
	  }
	}
	
	function getPBMWidth(elem, props, which) {
	  var value = 0, prop, j, i;
	  for (j = 0; j < props.length; j++) {
	    prop = props[j];
	    if (prop) {
	      for (i = 0; i < which.length; i++) {
	        var cssProp;
	        if (prop === 'border') {
	          cssProp = prop + which[i] + 'Width';
	        } else {
	          cssProp = prop + which[i];
	        }
	        value += parseFloat(getComputedStyleX(elem, cssProp)) || 0;
	      }
	    }
	  }
	  return value;
	}
	
	/**
	 * A crude way of determining if an object is a window
	 * @member util
	 */
	function isWindow(obj) {
	  // must use == for ie8
	  /*jshint eqeqeq:false*/
	  return obj != null && obj == obj.window;
	}
	
	var domUtils = {};
	
	each(['Width', 'Height'], function (name) {
	  domUtils['doc' + name] = function (refWin) {
	    var d = refWin.document;
	    return Math.max(
	      //firefox chrome documentElement.scrollHeight< body.scrollHeight
	      //ie standard mode : documentElement.scrollHeight> body.scrollHeight
	      d.documentElement['scroll' + name],
	      //quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
	      d.body['scroll' + name],
	      domUtils['viewport' + name](d));
	  };
	
	  domUtils['viewport' + name] = function (win) {
	    // pc browser includes scrollbar in window.innerWidth
	    var prop = 'client' + name,
	      doc = win.document,
	      body = doc.body,
	      documentElement = doc.documentElement,
	      documentElementProp = documentElement[prop];
	    // 标准模式取 documentElement
	    // backcompat 取 body
	    return doc.compatMode === 'CSS1Compat' && documentElementProp ||
	      body && body[prop] || documentElementProp;
	  };
	});
	
	/*
	 得到元素的大小信息
	 @param elem
	 @param name
	 @param {String} [extra]  'padding' : (css width) + padding
	 'border' : (css width) + padding + border
	 'margin' : (css width) + padding + border + margin
	 */
	function getWH(elem, name, extra) {
	  if (isWindow(elem)) {
	    return name === 'width' ? domUtils.viewportWidth(elem) : domUtils.viewportHeight(elem);
	  } else if (elem.nodeType === 9) {
	    return name === 'width' ? domUtils.docWidth(elem) : domUtils.docHeight(elem);
	  }
	  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'],
	    borderBoxValue = name === 'width' ? elem.offsetWidth : elem.offsetHeight;
	  var computedStyle = getComputedStyleX(elem);
	  var isBorderBox = isBorderBoxFn(elem, computedStyle);
	  var cssBoxValue = 0;
	  if (borderBoxValue == null || borderBoxValue <= 0) {
	    borderBoxValue = undefined;
	    // Fall back to computed then un computed css if necessary
	    cssBoxValue = getComputedStyleX(elem, name);
	    if (cssBoxValue == null || (Number(cssBoxValue)) < 0) {
	      cssBoxValue = elem.style[name] || 0;
	    }
	    // Normalize '', auto, and prepare for extra
	    cssBoxValue = parseFloat(cssBoxValue) || 0;
	  }
	  if (extra === undefined) {
	    extra = isBorderBox ? BORDER_INDEX : CONTENT_INDEX;
	  }
	  var borderBoxValueOrIsBorderBox = borderBoxValue !== undefined || isBorderBox;
	  var val = borderBoxValue || cssBoxValue;
	  if (extra === CONTENT_INDEX) {
	    if (borderBoxValueOrIsBorderBox) {
	      return val - getPBMWidth(elem, ['border', 'padding'],
	          which, computedStyle);
	    } else {
	      return cssBoxValue;
	    }
	  } else if (borderBoxValueOrIsBorderBox) {
	    return val + (extra === BORDER_INDEX ? 0 :
	        (extra === PADDING_INDEX ?
	          -getPBMWidth(elem, ['border'], which, computedStyle) :
	          getPBMWidth(elem, ['margin'], which, computedStyle)));
	  } else {
	    return cssBoxValue + getPBMWidth(elem, BOX_MODELS.slice(extra),
	        which, computedStyle);
	  }
	}
	
	var cssShow = {position: 'absolute', visibility: 'hidden', display: 'block'};
	
	// fix #119 : https://github.com/kissyteam/kissy/issues/119
	function getWHIgnoreDisplay(elem) {
	  var val, args = arguments;
	  // in case elem is window
	  // elem.offsetWidth === undefined
	  if (elem.offsetWidth !== 0) {
	    val = getWH.apply(undefined, args);
	  } else {
	    swap(elem, cssShow, function () {
	      val = getWH.apply(undefined, args);
	    });
	  }
	  return val;
	}
	
	each(['width', 'height'], function (name) {
	  var first = name.charAt(0).toUpperCase() + name.slice(1);
	  domUtils['outer' + first] = function (el, includeMargin) {
	    return el && getWHIgnoreDisplay(el, name, includeMargin ? MARGIN_INDEX : BORDER_INDEX);
	  };
	  var which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
	
	  domUtils[name] = function (elem, val) {
	    if (val !== undefined) {
	      if (elem) {
	        var computedStyle = getComputedStyleX(elem);
	        var isBorderBox = isBorderBoxFn(elem);
	        if (isBorderBox) {
	          val += getPBMWidth(elem, ['padding', 'border'], which, computedStyle);
	        }
	        return css(elem, name, val);
	      }
	      return;
	    }
	    return elem && getWHIgnoreDisplay(elem, name, CONTENT_INDEX);
	  };
	});
	
	function css(el, name, value) {
	  if (typeof name === 'object') {
	    for (var i in name) {
	      css(el, i, name[i]);
	    }
	    return;
	  }
	  if (typeof value !== 'undefined') {
	    if (typeof value === 'number') {
	      value = value + 'px';
	    }
	    el.style[name] = value;
	  } else {
	    return getComputedStyleX(el, name);
	  }
	}
	
	function mix(to, from) {
	  for (var i in from) {
	    to[i] = from[i];
	  }
	  return to;
	}
	
	var utils = module.exports = {
	  getWindow: function (node) {
	    var doc = node.ownerDocument || node;
	    return doc.defaultView || doc.parentWindow;
	  },
	  offset: function (el, value) {
	    if (typeof value !== 'undefined') {
	      setOffset(el, value);
	    } else {
	      return getOffset(el);
	    }
	  },
	  isWindow: isWindow,
	  each: each,
	  css: css,
	  clone: function (obj) {
	    var ret = {};
	    for (var i in obj) {
	      ret[i] = obj[i];
	    }
	    var overflow = obj.overflow;
	    if (overflow) {
	      for (i in obj) {
	        ret.overflow[i] = obj.overflow[i];
	      }
	    }
	    return ret;
	  },
	  mix: mix,
	  scrollLeft: function (w, v) {
	    if (isWindow(w)) {
	      if (v === undefined) {
	        return getScrollLeft(w);
	      } else {
	        window.scrollTo(v, getScrollTop(w));
	      }
	    } else {
	      if (v === undefined) {
	        return w.scrollLeft;
	      } else {
	        w.scrollLeft = v;
	      }
	    }
	  },
	  scrollTop: function (w, v) {
	    if (isWindow(w)) {
	      if (v === undefined) {
	        return getScrollTop(w);
	      } else {
	        window.scrollTo(getScrollLeft(w), v);
	      }
	    } else {
	      if (v === undefined) {
	        return w.scrollTop;
	      } else {
	        w.scrollTop = v;
	      }
	    }
	  },
	  merge: function () {
	    var ret = {};
	    for (var i = 0; i < arguments.length; i++) {
	      utils.mix(ret, arguments[i]);
	    }
	    return ret;
	  },
	  viewportWidth: 0,
	  viewportHeight: 0
	};
	
	mix(utils, domUtils);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var assign = __webpack_require__(7);
	var insertKeyframesRule = __webpack_require__(10);
	
	/**
	 * @type {Object}
	 */
	var keyframes = {
	    '0%': {
	        transform: 'rotate(0deg) scale(1)'
	    },
	    '50%': {
	        transform: 'rotate(180deg) scale(0.8)'
	    },
	    '100%': {
	        transform: 'rotate(360deg) scale(1)'
	    }
	};
	
	/**
	 * @type {String}
	 */
	var animationName = insertKeyframesRule(keyframes);
	
	var Loader = React.createClass({displayName: "Loader",
	    /**
	     * @type {Object}
	     */
	    propTypes: {
	        loading: React.PropTypes.bool,
	        color: React.PropTypes.string,
	        size: React.PropTypes.string
	    },
	
	    /**
	     * @return {Object}
	     */
	    getDefaultProps: function() {
	        return {
	            loading: true,
	            color: '#ffffff',
	            size: '35px'
	        };
	    },
	
	    /**
	     * @return {Object}
	     */
	    getBallStyle: function() {
	        return {
	            width: this.props.size,
	            height: this.props.size,
	            border: '2px solid',
	            borderColor: this.props.color,
	            borderBottomColor: 'transparent',
	            borderRadius: '100%',
	            background: 'transparent !important'
	        };
	    },
	
	    /**
	     * @param  {Number} i
	     * @return {Object}
	     */
	    getAnimationStyle: function(i) {
	        var animation = [animationName, '0.75s', '0s', 'infinite', 'linear'].join(' ');
	        var animationFillMode = 'both';
	
	        return {
	            animation: animation,
	            animationFillMode: animationFillMode
	        };
	    },
	
	    /**
	     * @param  {Number} i
	     * @return {Object}
	     */
	    getStyle: function(i) {
	        return assign(
	            this.getBallStyle(i),
	            this.getAnimationStyle(i),
	            {
	                display: 'inline-block'
	            }
	        );
	    },
	
	    /**
	     * @param  {Boolean} loading
	     * @return {ReactComponent || null}
	     */
	    renderLoader: function(loading) {
	        if (loading) {
	            return (
	                React.createElement("div", {id: this.props.id, className: this.props.className}, 
	                    React.createElement("div", {style: this.getStyle()})
	                )
	            );
	        }
	
	        return null;
	    },
	
	    render: function() {
	        return this.renderLoader(this.props.loading);
	    }
	});
	
	module.exports = Loader;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getVendorPropertyName = __webpack_require__(8);
	
	module.exports = function(target, sources) {
	  var to = Object(target);
	  var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
	    var nextSource = arguments[nextIndex];
	    if (nextSource == null) {
	      continue;
	    }
	
	    var from = Object(nextSource);
	
	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	  }
	
	  var prefixed = {};
	  for (var key in to) {
	    prefixed[getVendorPropertyName(key)] = to[key]
	  }
	
	  return prefixed
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var builtinStyle = __webpack_require__(9);
	var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
	var domVendorPrefix;
	
	// 2009 spec only
	var flexbox = {
	  flex: ['WebkitFlex', 'WebkitBoxFlex'],
	  order: ['WebkitOrder','WebkitBoxOrdinalGroup'],
	  // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/flex-direction.coffee
	  flexDirection: ['WebkitFlexDirection', 'WebkitBoxOrient', 'WebkitBoxDirection'],
	  // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/align-items.coffee
	  alignItems: ['WebkitAlignItems', 'WebkitBoxAlign'],
	  // https://github.com/postcss/autoprefixer/blob/master/lib/hacks/justify-content.coffee
	  justifyContent: ['WebkitJustifyContent', 'WebkitBoxPack'],
	  flexWrap: ['WebkitFlexWrap'],
	  alignSelf: ['WebkitAlignSelf'],
	}
	
	// Helper function to get the proper vendor property name. (transition => WebkitTransition)
	module.exports = function(prop, isSupportTest) {
	
	  var vendorProp;
	  if (prop in builtinStyle) return prop;
	
	  if(flexbox[prop]){
	    // TODO: cache the result
	    var flexProperties = flexbox[prop];
	    for (var i = 0; i < flexProperties.length; ++i) {
	      if (flexProperties[i] in builtinStyle) {
	        return flexProperties[i];
	      }
	    }
	
	  }else{
	
	    var UpperProp = prop.charAt(0).toUpperCase() + prop.substr(1);
	
	    if (domVendorPrefix) {
	
	      vendorProp = domVendorPrefix + UpperProp;
	      if (vendorProp in builtinStyle) {
	        return vendorProp;
	      }
	    } else {
	
	      for (var i = 0; i < prefixes.length; ++i) {
	        vendorProp = prefixes[i] + UpperProp;
	        if (vendorProp in builtinStyle) {
	          domVendorPrefix = prefixes[i];
	          return vendorProp;
	        }
	      }
	    }
	  }
	
	  // if support test, not fallback to origin prop name
	  if (!isSupportTest) {
	    return prop;
	  }
	
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = document.createElement('div').style;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var insertRule = __webpack_require__(11);
	var vendorPrefix = __webpack_require__(12)();
	var index = 0;
	
	module.exports = function(keyframes) {
	  // random name
	  var name = 'anim_' + (++index) + (+new Date);
	  var css = "@" + vendorPrefix + "keyframes " + name + " {";
	
	  for (var key in keyframes) {
	    css += key + " {";
	
	    for (var property in keyframes[key]) {
	      var part = ":" + keyframes[key][property] + ";";
	      // We do vendor prefix for every property
	      css += vendorPrefix + property + part;
	      css += property + part;
	    }
	
	    css += "}";
	  }
	
	  css += "}";
	
	  insertRule(css);
	
	  return name
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	var extraSheet;
	
	module.exports = function(css) {
	
	  if (!extraSheet) {
	    // First time, create an extra stylesheet for adding rules
	    extraSheet = document.createElement('style');
	    document.getElementsByTagName('head')[0].appendChild(extraSheet);
	    // Keep reference to actual StyleSheet object (`styleSheet` for IE < 9)
	    extraSheet = extraSheet.sheet || extraSheet.styleSheet;
	  }
	
	  var index = (extraSheet.cssRules || extraSheet.rules).length;
	  extraSheet.insertRule(css, index);
	
	  return extraSheet;
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	var cssVendorPrefix;
	
	module.exports = function() {
	
	  if (cssVendorPrefix) return cssVendorPrefix;
	
	  var styles = window.getComputedStyle(document.documentElement, '');
	  var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];
	
	  return cssVendorPrefix = '-' + pre + '-';
	}


/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-autocomplete.js.map