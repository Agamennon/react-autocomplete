import React from 'react';
import ReactDOM from 'react-dom';

import { getStates, removeDiacritics } from '../utils'
import Autocomplete from '../../lib/index'



export let styles = {
    item: {
        padding: '8px',
        cursor: 'default',
        fontSize:'12px'
    },

    highlightedItem: {
        color: 'white',
        // background: 'hsl(200, 50%, 50%)',
        background: '#4E5066',
        padding: '8px',
        fontSize:'12px',
        cursor: 'default'

    },

    menu: {
        border: 'solid 1px #ccc'
    }
};


export let wrapperStyle = {
   // position:'relative',
   // width:'100%'
};
export let inputProps = {
   // type:'search',
    //readOnly:'read-only',
    style:{width:'100%',height:'30px',  boxSizing:'border-box', fontSize:'12', paddingLeft:'5px', paddingRight:'22px'}
};



export let menuStyle = {
  //  width:'inherit',
  //  left:'0',
  //  top:'33px',
 //   borderRadius: '3px',
  //  border:'1px solid black',
  //  background: 'white',
  //  padding: '2px 0',
 //   zIndex:'2',
 //   position: 'absolute',
 //   overflow: 'auto',
 //   maxHeight: '200px' // TODO: don't cheat, let it flow to the bottom

};

export default class App extends React.Component {

    constructor(){
        super();
        this.state ={
            items:getStates(),
           value:'333'
        };
    }

    click(event) {
        var data = getStates();
       var half_length = Math.ceil(data.length / 2);

        var leftSide = data.splice(0,10);
        this.refs.gui.setFocus();
    /*    this.setState({
        //    items:leftSide,
            value:'111'
        });*/
       /* this.setState({
            value:'hahaha'
        });*/

        /* for (var x = 0 ; x < 5000 ; x++ ){
         console.log(x);
         }*/
       // this.refs.gui.setValue('heelo!');
    }


    getItemValue(item) {
        return item.label
    }


    matchStateToTerm(state, value) {
        return (
            removeDiacritics(state.label.toUpperCase()).indexOf(removeDiacritics(value.toUpperCase().trim())) !== -1
        )
    }

    renderItem(item, isHighlighted) {
        return (
            <div
                style={isHighlighted ? styles.highlightedItem : styles.item}
                key={item.value}
            >
                {item.label}
            </div>
        )
    }

    findObject(items,value){
        var obj = null;

        items.some((item)=>{ //find the option that matches the value to send to change
            if ((removeDiacritics(value.toUpperCase()) == removeDiacritics(item.label.toUpperCase().trim())) || (item.value == value)){
                obj = item;

                return true;
            }
        });
        return obj
    }

    findLabelFromValue(input,items){

        var label = input;
        items.some((item)=>{ //find the option that matches the value to send to change
            if (input == item.value){
                label = item.label;
                return true;
            }
        });
        return label
    }


    onChange(event,value,item){
       /* this.setState({
            value
        });*/
       /* console.log('change',event);
        console.log('value',value);
        console.log('item',item);*/
    }


    onBlur(event,value,item){
       /* this.setState({
            value:'bugaaa'
        });*/

        console.log('blur',event);
        console.log('value',value);
        console.log('item',item);
    }

    onSelect(value,item,a){
      //  this.value = 'merda'
      /*  console.log(value)
        console.log(item)
        console.log(a)*/
      /*  this.setState({
            value:'buga'
        });*/
        //this.forceUpdate()

   }




    render() {



        var options = [
            {
             label:'banana',
             value:'111'
            },
            {
             label:'pera',
             value:'222'
            },
            {
             label:'uva',
             value:'333'
            }
        ];



    /*    var inputProps = {
            style: {width: '100%'}
        };
        var wrapperStyle = {
            width: '100%'
        };
        var menuStyle = {

            width: '100%',
            backgroundColor: 'white',
            //  border:'1px solid black'
            borderRadius: '3px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
            ///   background: 'rgba(255, 255, 255, 0.9)',
            //   padding: '2px 0',
            //   fontSize: '90%',
            zIndex: 2,
            position: 'fixed',
            overflow: 'auto',
            maxHeight: '50%' // TODO: don't cheat, let it flow to the bottom

        };
*/
     //  inputProps.value = this.state.value;
        //initialValue={this.state.value}
        //value = {this.state.value}
        return (
            <div style={{width: '300px'}}>
                <h1>Basic Example with Static Data</h1>

                <p>
                    When using static data, you use the client to sort and filter the items,
                    so <code>Autocomplete</code> has methods baked in to help.
                </p>

                <Autocomplete
                    ref="gui"
                    value={this.state.value}
                    minInput={0}
                //    autoSelect={false}
                    isLoading={false}
                    onChange={this.onChange.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    exact={true}
                    toUpperOnBlur={true}
                    placeholder='haha'
                    focusOnCreate={false}
                    onSelect={this.onSelect.bind(this,{'a':'yehue'})}
                    items={options}
                    findObject={this.findObject.bind(this)}
                    findLabelFromValue={this.findLabelFromValue.bind(this)}
                   // wrapperStyle={wrapperStyle}
                    inputProps={inputProps}
                   // menuStyle={menuStyle}

                    getItemValue={this.getItemValue.bind(this)}
                    shouldItemRender={this.matchStateToTerm.bind(this)}
                    //   sortItems={sortStates}
                    renderItem={this.renderItem.bind(this)}
                />
                <input/>

                <button onClick={this.click.bind(this)}>do</button>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('container'));

