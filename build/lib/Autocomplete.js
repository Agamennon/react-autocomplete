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

//let _debugStates = [];

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
    inputProps: React.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      wrapperProps: {},
      wrapperStyle: {
        display: 'inline-block'
      },
      inputProps: {},
      minInput: 0,
      onBlur: function onBlur() {},
      onChange: function onChange() {},
      onSelect: function onSelect(value, item) {},
      renderMenu: function renderMenu(items, value, style) {

        return React.createElement('div', { style: _extends({}, style, this.menuStyle), children: items });
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
  },

  componentWillReceiveProps: function componentWillReceiveProps() {
    this._performAutoCompleteOnUpdate = true;
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    //if (this.state.isOpen === true && prevState.isOpen === false)
    // this.setMenuPositions();

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
    this.setState({
      value: event.target.value
    }, function () {
      _this.props.onChange(event, _this.state.value);
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

      var index = highlightedIndex === null || highlightedIndex === this.getFilteredItems().length - 1 ? 0 : highlightedIndex + 1;
      this._performAutoCompleteOnKeyUp = true;
      this.setState({
        highlightedIndex: index,
        isOpen: true
      });
    },

    ArrowUp: function ArrowUp(event) {
      event.preventDefault();
      var highlightedIndex = this.state.highlightedIndex;

      var index = highlightedIndex === 0 || highlightedIndex === null ? this.getFilteredItems().length - 1 : highlightedIndex - 1;
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
        var item = this.getFilteredItems()[this.state.highlightedIndex];
        this.setState({
          value: this.props.getItemValue(item),
          isOpen: false,
          highlightedIndex: null
        }, function () {
          //this.refs.input.focus() // TODO: file issue
          _this2.refs.input.setSelectionRange(_this2.state.value.length, _this2.state.value.length);
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

  getFilteredItems: function getFilteredItems() {
    var _this3 = this;

    var items = [];
    var time = Date.now();

    if (this.state.value.length >= this.props.minInput) {
      items = this.props.items;

      if (this.props.shouldItemRender) {
        items = items.filter(function (item) {
          return _this3.props.shouldItemRender(item, _this3.state.value);
        });
      }

      if (this.props.sortItems) {
        items.sort(function (a, b) {
          return _this3.props.sortItems(a, b, _this3.state.value);
        });
      }
    }

    console.log(time - Date.now());

    return items;
  },

  maybeAutoCompleteText: function maybeAutoCompleteText() {
    var _this4 = this;

    if (this.state.value === '') return;
    var highlightedIndex = this.state.highlightedIndex;

    var items = this.getFilteredItems();
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

  /* setMenuPositions () {
     var node = this.refs.input;
     var rect = node.getBoundingClientRect();
     var computedStyle = getComputedStyle(node);
     var marginBottom = parseInt(computedStyle.marginBottom, 10);
     var marginLeft = parseInt(computedStyle.marginLeft, 10);
     var marginRight = parseInt(computedStyle.marginRight, 10);
     this.setState({
       menuTop: rect.bottom + marginBottom,
       menuLeft: rect.left + marginLeft,
       menu0: rect.width + marginLeft + marginRight
     })
   },*/

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

    var items = this.getFilteredItems().map(function (item, index) {
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
    var style = {
      left: this.state.menuLeft,
      top: this.state.menuTop,
      minWidth: this.state.menuWidth
    };

    //var menu = items.length > 0 ? this.props.renderMenu(items, this.state.value, style) : '';
    var menu = this.props.renderMenu(items, this.state.value, style);
    return React.cloneElement(menu, { ref: 'menu' });
  },

  handleInputBlur: function handleInputBlur(event) {
    var _this7 = this;

    if (this._ignoreBlur) return;
    this.setState({
      isOpen: false,
      highlightedIndex: null
    }, function () {
      _this7.props.onBlur(event, _this7.state.value);
    });
  },

  handleInputFocus: function handleInputFocus() {

    if (this._ignoreBlur) return;
    if (!this.state.isOpen) {
      console.log('focus');
      this.setState({ isOpen: true });
    }
  },

  handleInputClick: function handleInputClick() {

    if (!this.state.isOpen) {
      console.log('click');
      this.setState({ isOpen: true });
    }
  },

  render: function render() {
    var _this8 = this;

    //var __CLIENT__ = __CLIENT__;
    //  console.log(<Loader/>)
    /* if (!Loader){
         Loader = <div>hello</div>
     } else {
         Loader =  <Loader color="#26A65B" size="13px" />
     }*/
    /*if (this.props.debug) { // you don't like it, you love it
      _debugStates.push({
        id: _debugStates.length,
        state: this.state
      })
    }*/

    //var wrapperStyle = Object.assign(this.props.wrapperStyle,{display:'table'});
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
      this.state.isOpen && !!this.getFilteredItems().length && this.renderMenu(),
      React.createElement(
        'span',
        { style: { position: 'relative', display: 'table-cell' } },
        React.createElement(
          'div',
          { style: { position: 'absolute',
              left: '-35px', top: '6px',
              padding: '0px',
              //   backgroundColor:'#196177',
              width: '30x',
              height: '30px',
              zIndex: '10'
              //   background:"url('./ajax-loader.gif') no-repeat",
              //    backgroundPosition: '50% 50%'
            } },
          !isServer() && this.props.isLoading ? React.createElement(Loader, { color: '#26A65B', size: '22px' }) : null
        )
      )
    );
  }
});

module.exports = Autocomplete;

//<Loader color="#26A65B" size="13px" />
/*


.my-combobox.small-loading{

    background-color: #196177;
    background:url('/resources/stylesheets/images/ajax-loader.gif') no-repeat ;
    background-position: 50% 50%;

}*/
/*this.state.isOpen && this.renderMenu()*/ /*this.props.debug && (
                                            <pre style={{marginLeft: 300}}>
                                              {JSON.stringify(_debugStates.slice(_debugStates.length - 5, _debugStates.length), null, 2)}
                                            </pre>
                                           )*/