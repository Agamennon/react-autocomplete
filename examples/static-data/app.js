import React from 'react'
import { getStates, matchStateToTerm, sortStates, styles } from '../utils'
import Autocomplete from '../../lib/index'

let App = React.createClass({

    click(event){
       /* for (var x = 0 ; x < 5000 ; x++ ){
            console.log(x);
        }*/
        this.refs.gui.setValue('heelo!');
    },

  render () {
      var inputProps = {
          style:{width:'100%'}
      };
      var wrapperStyle = {
          width:'100%'
      };
      var menuStyle = {

              width:'100%',
           backgroundColor:'white',
        //  border:'1px solid black'
          borderRadius: '3px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      ///   background: 'rgba(255, 255, 255, 0.9)',
       //   padding: '2px 0',
       //   fontSize: '90%',
          zIndex:2,
          position: 'fixed',
         overflow: 'auto',
          maxHeight: '50%' // TODO: don't cheat, let it flow to the bottom


      };

    return (
      <div style={{width:'50%'}}>
        <h1>Basic Example with Static Data</h1>

        <p>
          When using static data, you use the client to sort and filter the items,
          so <code>Autocomplete</code> has methods baked in to help.
        </p>

        <Autocomplete
          ref="gui"
          initialValue=""
          minInput={1}
          autoSelect={false}
          isLoading={true}
          items={getStates()}
          inputProps={inputProps}
          wrapperStyle={wrapperStyle}
          menuStyle={menuStyle}
          getItemValue={(item) => item.name}
          shouldItemRender={matchStateToTerm}
          sortItems={sortStates}
          renderItem={(item, isHighlighted) => (
            <div
              style={isHighlighted ? styles.highlightedItem : styles.item}
              key={item.abbr}
            >{item.name}</div>
          )}
        />
         <button onClick={this.click.bind(this)}>do</button>
      </div>
    )
  }
});

React.render(<App/>, document.getElementById('container'))

