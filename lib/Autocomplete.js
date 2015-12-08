
const React = require('react');
const scrollIntoView = require('dom-scroll-into-view');

function isServer() {
    return ! (typeof window != 'undefined' && window.document);
}

var Loader = null;
var isIE10 = false;
if (!isServer()){
    Loader = require('halogen/ClipLoader');
    if (navigator.appVersion.indexOf("MSIE 10") !== -1)
    {
       isIE10 = true
    }
}

//default props



let Autocomplete = React.createClass({

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
        minInput:React.PropTypes.any,
        autoSelect:React.PropTypes.any,
        inputProps: React.PropTypes.object,
        findObject: React.PropTypes.func,
        chevronStyle: React.PropTypes.object

    },


    getDefaultProps () {

        return {
            wrapperProps: {},
            inputProps: {
              //  type:'search',
                //padding:'3px',
                style:{width:'100%',height:'30px', boxSizing:'border-box', fontSize:'12', paddingLeft:'5px', paddingRight:'22px'}
            },
            minInput:0,
            value:'',
            readOnly:false,
            autoSelect:false,
            showChevron:true,
            onBlur () {},
            onChange () {},
            onSelect (value, item) {},
            renderMenu (items, value) {

                return <div style={{...this.menuStyle}} children={items}/>
            },
            shouldItemRender () { return true },
            menuStyle: {
                width:'inherit',
                left:'0',
                top:'30px',
              //  borderRadius: '3px',
                border:'1px solid black',
                background: 'white',
            //    padding: '2px 0',
                zIndex:'2',
                position: 'absolute',
                overflow: 'auto',
                maxHeight: '200px'
            },
            spinnerStyle : {
                position:'absolute',
                left:'-6px',top:'5px',
                padding:'0px',
                width:'30x',
                height:'30px',
                zIndex:'10'
            },
            wrapperStyle : {
                position:'relative',
                width:'100%',
                display:'table'
            },
            chevronStyle : {
                position:'absolute',
                left:'-20px',top:'0px',
                pointerEvents:'none',
               // padding:'0px',
                fontSize:'18px',
              //  align:'center',
             //   width:'10px',
            //    height:'10px',
                zIndex:'2'
            }


        }
    },

    getInitialState () {

        return {
            isOpen: false,
            highlightedIndex: null
        }
    },

    componentWillMount () {

        this._ignoreBlur = false;
        this._performAutoCompleteOnUpdate = false;
        this._performAutoCompleteOnKeyUp = false;
        var items = this.getFilteredItems(this.props.items || [],this.props.value);

        this.setState({
            items,
            itemsLength:items.length
        });
        //this.state.items = this.props.options;
    },

    shouldComponentUpdate (nextProps, nextState) {
       // console.log(nextProps);
       // console.log(nextState);


        return  nextProps.value !== this.props.value ||
            nextState.highlightedIndex !== this.state.highlightedIndex ||
                nextState.isOpen !== this.state.isOpen



    },

    componentWillReceiveProps (nextProps) {
        this._performAutoCompleteOnUpdate = true;

      /*  console.log(nextProps.value);
        console.log(this.props.value);*/
        if (this.props.items.length !== nextProps.items.length){
            var items = this.getFilteredItems(nextProps.items || [],nextProps.value);

            this.setState({
                items:items,
                itemsLength:items.length
            })
        }

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


  /*  setValue(value) {
        this.setState({
            value
        });
    },*/


    handleChange (event) {
        this._performAutoCompleteOnKeyUp = true;

        var item = null;
        var value =  event.target.value;
        var compare = value.substr(0,value.length-1);

        var itemsToFilter = compare === this.props.value ? this.state.items : this.props.items;
        if  ((value.length >= this.props.minInput) && (this.state.itemsLength === 0)){
            itemsToFilter = this.props.items;
        }
        if (!itemsToFilter){
            itemsToFilter = [];
        }


        if (this.props.findObject){
            item = this.props.findObject(itemsToFilter,value);
        }
        var items = this.getFilteredItems(itemsToFilter,value);


        this.setState({
            items,
            itemsLength:items.length
        }, () => {
            this.props.onChange(event, value, item)
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
                var value = this.props.getItemValue(item);
                this.setState({

                    isOpen: false,
                    highlightedIndex: null
                }, () => {
                    //desceleciona
                    if (this.props.autoSelect){
                        this.refs.input.setSelectionRange(
                            value.length,
                            value.length
                        );
                    }
                    this.props.onSelect(value, item)
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
        if (this.props.value === '' || (this.props.value.length < this.props.minInput))
            return;
        var { highlightedIndex } = this.state;
        var items = this.state.items;

        if (items.length ===  0)
            return;
        var matchedItem = highlightedIndex !== null ?
            items[highlightedIndex] : items[0];
        var itemValue = this.props.getItemValue(matchedItem);
        var itemValueDoesMatch = (itemValue.toLowerCase().indexOf(
            this.props.value.toLowerCase()
        ) === 0);
        if (itemValueDoesMatch) {
            var node = this.refs.input;
            var setSelection = () => {
                node.value = itemValue;
                node.setSelectionRange(this.props.value.length, itemValue.length)
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
            isOpen: false,
            highlightedIndex: null
        }, () => {
            this.props.onSelect(this.props.getItemValue(item), item);
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
        var menu =  this.props.renderMenu(items, this.props.value);
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
                item = this.props.findObject(this.state.items,event.target.value);
            }
            this.props.onBlur(event, event.target.value, item);
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

     //  console.log('rendering'+Math.random());
        return (
            <div {...this.props.wrapperProps} style={{...this.props.wrapperStyle}}>

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
                    value={this.props.value}
                />
                {this.state.isOpen && !!this.state.itemsLength && this.renderMenu()}
                {/*this.state.isOpen && this.renderMenu()*/}

         <div style={{position:'relative',  display:'table-cell'}}>
             <div style={this.props.spinnerStyle}>
                 {!isServer() && this.props.isLoading ? <Loader color="#26A65B" size="17px" /> : null}
             </div>
             {this.props.showChevron  && !this.props.isLoading  &&  !isIE10 ? <div  style={this.props.chevronStyle}>
                  &#9662;
              </div> : null}

         </div>

            </div>

        )
    }
});

module.exports = Autocomplete;
//&& !this.props.isLoading
/*

 <div>
 &#x025BE;
 &#9662;</div>*/
