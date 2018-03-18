import React from 'react';
import { Text, TextArea } from '../components/Inputs';
import { addRelationship, removeRelationship, changeType } from '../actions';
import RelationshipInput from '../components/RelationshipInput';
import { RelationshipTag, RelationshipTagGroup } from '../components/RelationshipTags'
import Button from '../components/Button';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';


class PeopleRelationships extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      relationshipInput: false
    }
  }

  showRelationshipInput = () => {
    this.setState({ relationshipInput: true });
  }

  hideRelationshipInput = () => {
    this.setState({ relationshipInput: false });
  }

  addRelationship = (personId, actionId, thingId) => {
    this.props.addRelationship(personId, actionId, thingId);
  }

  removeRelationship = (personId, actionId, thingId) => {
    this.props.removeRelationship(personId, actionId, thingId);
  }

  changeType = (event) => {
    this.props.changeType(event.target.value)
  }

  save = (personId, actionId, thingId) => {
    this.addRelationship(personId, actionId, thingId);
    this.hideRelationshipInput();
  }

  render(){
    let { person, relationships, people, actions, things } = this.props;
    return (
      <main className="container">
        <div className="row gutter-10">
          <div className="app__left col-2">
            <div className="type-edit">
              <Text value={person.type} onChange={this.changeType}/>
            </div>
          </div>
          <div className="app__spacer col-1"><div /></div>
          <div className="app__right col-9">
            <div className="section-heading">
              <h2>Relationships</h2>
            </div>
            <div className="relationships">
              {relationships.map((r,i)=>(
                <div className="relationships__list">
                  <RelationshipTagGroup key={`relationship-${i}`}>
                    <RelationshipTag type="person" label={person.type} />
                    <RelationshipTag type="action" label={actions[r.actionId].type} />
                    <RelationshipTag type="thing" label={things[r.thingId].type} />
                  </RelationshipTagGroup>
                  <Button className='button-square-15'
                    color="red"
                    label="x"
                    onClick={()=>{this.removeRelationship(r.personId, r.actionId, r.thingId)}} />
                </div>
              ))}
            </div>
            <div className="add-relationship-button">
              <Button label="+ relationship" onClick={this.showRelationshipInput}/>
            </div>
            <div className="relationship-input-wrapper">
              {this.state.relationshipInput &&
                <RelationshipInput type='person' personId={person.id} save={this.save} close={this.hideRelationshipInput}/>
              }
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = (state) => ({
  person: state.activePerson,
  relationships: state.relationships.people[state.activePerson.id] || [],
  people: state.people.types,
  actions: state.actions.types ,
  things: state.things.types
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addRelationship: (personId, actionId, thingId) => addRelationship(personId, actionId, thingId),
  removeRelationship: (personId, actionId, thingId) => removeRelationship(personId, actionId, thingId),
  changeType: type => changeType('person', type)
}, dispatch);

PeopleRelationships = connect(mapStateToProps, mapDispatchToProps)(PeopleRelationships);

export default PeopleRelationships;