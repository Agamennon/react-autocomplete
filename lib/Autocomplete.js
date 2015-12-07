
const React = require('react');
const scrollIntoView = require('dom-scroll-into-view');

function isServer() {
    return ! (typeof window != 'undefined' && window.document);
}
var Loader = null;
if (!isServer()){
    Loader = require('halogen/ClipLoader');
}


let Autocomplete = React.createClass({

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
        minInput:React.PropTypes.any,
        autoSelect:React.PropTypes.any,
        inputProps: React.PropTypes.object,
        findObject: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            wrapperProps: {},
            wrapperStyle: {
                display: 'inline-block'
            },
            inputProps: {},
            minInput:0,
            autoSelect:false,
            onBlur () {},
            onChange () {},
            onSelect (value, item) {},
            renderMenu (items, value) {

                return <div style={{...this.menuStyle}} children={items}/>
            },
            shouldItemRender () { return true },
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
        }
    },

    getInitialState () {

        return {
            value: this.props.initialValue || '',
            isOpen: false,
            highlightedIndex: null
        }
    },

    componentWillMount () {

        this._ignoreBlur = false;
        this._performAutoCompleteOnUpdate = false;
        this._performAutoCompleteOnKeyUp = false;
        var items = this.getFilteredItems(this.props.items || [],this.state.value);

        this.setState({
            items,
            itemsLength:items.length
        });
        //this.state.items = this.props.options;
    },

    componentWillReceiveProps (nextProps) {
        this._performAutoCompleteOnUpdate = true;
        console.log('will receive');
        var items = this.getFilteredItems(nextProps.items || [],this.state.value);
        this.setState({
            items:items,
            itemsLength:items.length
        })

    },

    componentDidUpdate (prevProps, prevState) {
        if (this.state.isOpen && this._performAutoCompleteOnUpdate) {
            this._performAutoCompleteOnUpdate = false;
            this.maybeAutoCompleteText()
        }
        this.maybeScrollItemIntoView()
    },

    maybeScrollItemIntoView () {
        if (this.state.isOpen === true && this.state.highlightedIndex !== null) {
            var itemNode = this.refs[`item-${this.state.highlightedIndex}`];
            var menuNode = this.refs.menu;
            scrollIntoView(itemNode, menuNode, { onlyScrollIfNeeded: true })
        }
    },

    handleKeyDown (event) {
        if (this.keyDownHandlers[event.key])
            this.keyDownHandlers[event.key].call(this, event);
        else {
            this.setState({
                highlightedIndex: null,
                isOpen: true
            })
        }
    },


    setValue(value) {
        this.setState({
            value
        });
    },


    handleChange (event) {
        this._performAutoCompleteOnKeyUp = true;

        var item = null;
        var value =  event.target.value;
        var compare = value.substr(0,value.length-1);

        var itemsToFilter = compare === this.state.value ? this.state.items : this.props.items;
        if  ((value.length >= this.props.minInput) && (this.state.itemsLength === 0)){
            itemsToFilter = this.props.items;
        }
        if (!itemsToFilter){
            itemsToFilter = [];
        }


        if (this.props.findObject){
            item = this.props.findObject(itemsToFilter,value);
        }
        var items = this.getFilteredItems(itemsToFilter,event.target.value);


        this.setState({
            value: event.target.value,
            items,
            itemsLength:items.length
        }, () => {
            this.props.onChange(event, this.state.value, item)
        })

    },

    handleKeyUp () {
        if (this._performAutoCompleteOnKeyUp) {
            this._performAutoCompleteOnKeyUp = false;
            this.maybeAutoCompleteText()
        }
    },

    keyDownHandlers: {
        ArrowDown (event) {
            event.preventDefault();
            var { highlightedIndex } = this.state;
            var index = (
                highlightedIndex === null ||
                highlightedIndex === this.state.itemsLength - 1
            ) ?  0 : highlightedIndex + 1;
            this._performAutoCompleteOnKeyUp = true;
            this.setState({
                highlightedIndex: index,
                isOpen: true
            })
        },

        ArrowUp (event) {
            event.preventDefault();
            var { highlightedIndex } = this.state;
            var index = (
                highlightedIndex === 0 ||
                highlightedIndex === null
            ) ? this.state.itemsLength - 1 : highlightedIndex - 1;
            this._performAutoCompleteOnKeyUp = true;
            this.setState({
                highlightedIndex: index,
                isOpen: true
            })
        },

        Enter (event) {
            if (this.state.isOpen === false) {
                // already selected this, do nothing
                return
            }
            else if (this.state.highlightedIndex == null) {
                // hit enter after focus but before typing anything so no autocomplete attempt yet
                this.setState({
                    isOpen: false
                }, () => {
                    this.refs.input.select()
                })
            }
            else {
                var item = this.state.items[this.state.highlightedIndex];
                this.setState({
                    value: this.props.getItemValue(item),
                    isOpen: false,
                    highlightedIndex: null
                }, () => {
                    //desceleciona
                    if (this.props.autoSelect){
                        this.refs.input.setSelectionRange(
                            this.state.value.length,
                            this.state.value.length
                        );
                    }
                    this.props.onSelect(this.state.value, item)
                })
            }
        },

        Escape (event) {
            this.setState({
                highlightedIndex: null,
                isOpen: false
            })
        }
    },

    getFilteredItems (items,value) {
      //  console.log('filtering -'+Math.random());
        var result  = [];
      //  var time = Date.now();
        if (value.length >= this.props.minInput){
            result = items;

            if (this.props.shouldItemRender) {
                result = items.filter((item) => (
                    this.props.shouldItemRender(item, value)
                ))
            }
            if (this.props.sortItems) {
                result.sort((a, b) => (
                    this.props.sortItems(a, b, value)
                ))
            }
        }
       // console.log('filterd in = ',Date.now() - time);
        return result
    },

    maybeAutoCompleteText () {
        if (!this.props.autoSelect){
            return;
        }
        if (this.state.value === '' || (this.state.value.length < this.props.minInput))
            return;
        var { highlightedIndex } = this.state;
        var items = this.state.items;

        if (items.length ===  0)
            return;
        var matchedItem = highlightedIndex !== null ?
            items[highlightedIndex] : items[0];
        var itemValue = this.props.getItemValue(matchedItem);
        var itemValueDoesMatch = (itemValue.toLowerCase().indexOf(
            this.state.value.toLowerCase()
        ) === 0);
        if (itemValueDoesMatch) {
            var node = this.refs.input;
            var setSelection = () => {
                node.value = itemValue;
                node.setSelectionRange(this.state.value.length, itemValue.length)
            };

            if (highlightedIndex === null)
                this.setState({ highlightedIndex: 0 }, setSelection);
            else
                setSelection()
        }
    },

    highlightItemFromMouse (index) {
        this.setState({ highlightedIndex: index })
    },

    selectItemFromMouse (item) {
        this.setState({
            value: this.props.getItemValue(item),
            isOpen: false,
            highlightedIndex: null
        }, () => {
            this.props.onSelect(this.state.value, item);
            this.refs.input.focus();
            this.setIgnoreBlur(false)
        })
    },

    setIgnoreBlur (ignore) {
        this._ignoreBlur = ignore
    },

    renderMenu () {
        var items = this.state.items.map((item, index) => {
            var element = this.props.renderItem(
                item,
                this.state.highlightedIndex === index,
                {cursor: 'default'}
            );
            return React.cloneElement(element, {
                onMouseDown: () => this.setIgnoreBlur(true),
                onMouseEnter: () => this.highlightItemFromMouse(index),
                onClick: () => this.selectItemFromMouse(item),
                ref: `item-${index}`
            })
        });
        var menu =  this.props.renderMenu(items, this.state.value);
        return React.cloneElement(menu, { ref: 'menu' })
    },

    handleInputBlur (event) {
        if (this._ignoreBlur)
            return;
        this.setState({
            isOpen: false,
            highlightedIndex: null
        }, () => {
            var item = null;
            if (this.props.findObject){
                item = this.props.findObject(this.state.items,this.state.value);
            }
            this.props.onBlur(event, this.state.value, item);
        })
    },

    handleInputFocus () {

        if (this._ignoreBlur)
            return;
        if (!this.state.isOpen){

            this.setState({ isOpen: true })
        }

    },

    handleInputClick () {

        if (!this.state.isOpen){

            this.setState({ isOpen: true })
        }

    },

    render () {


        var wrapperStyle = this.props.wrapperStyle;
        wrapperStyle.display = 'table';
        return (
            <div {...this.props.wrapperProps} style={{...wrapperStyle}}>

                <input
                    {...this.props.inputProps}
                    //  style={Object.assign(this.props.inputProps.style,{display:'inline-block'})}
                    role="combobox"
                    aria-autocomplete="both"
                    ref="input"
                    onFocus={this.handleInputFocus}
                    onBlur={(event) => this.handleInputBlur(event)}
                    onChange={(event) => this.handleChange(event)}
                    onKeyDown={(event) => this.handleKeyDown(event)}
                    onKeyUp={(event) => this.handleKeyUp(event)}
                    onClick={this.handleInputClick}
                    value={this.state.value}
                />
                {this.state.isOpen && !!this.state.itemsLength && this.renderMenu()}
                {/*this.state.isOpen && this.renderMenu()*/}

         <span style={{position:'relative',  display:'table-cell'}}>
             <div style={
             {
              position:'absolute',
              left:'-55px',top:'6px',
              padding:'0px',
              width:'30x',
              height:'30px',
              zIndex:'10'

              }}>

                 {!isServer() && this.props.isLoading ? <Loader color="#26A65B" size="22px" /> : null}
             </div>
         </span>

            </div>

        )
    }
});

module.exports = Autocomplete;
