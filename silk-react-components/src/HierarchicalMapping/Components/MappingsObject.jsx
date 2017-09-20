import React from 'react';
import _ from 'lodash';
import className from 'classnames';
import {
    Button,
    Card,
    CardTitle,
    ConfirmationDialog,
    DisruptiveButton,
    DismissiveButton,
    NotAvailable,
} from 'ecc-gui-elements';
import {
    ThingIcon,
    RuleTitle,
    RuleTypes,
    ParentElement,
} from './MappingRule/SharedComponents';
import ObjectRule from './MappingRule/ObjectMappingRule';
import hierarchicalMappingChannel from '../store';
import UseMessageBus from '../UseMessageBusMixin';
import Navigation from '../Mixins/Navigation';

const MappingsObject = React.createClass({
    mixins: [UseMessageBus, Navigation],
    getInitialState() {
        return {
            expanded: false,
            editing: false,
            askForDiscard: false,
        };
    },
    componentDidMount() {
        this.subscribe(
            hierarchicalMappingChannel.subject('rulesView.toggle'),
            ({expanded, id}) => {
                // only trigger state / render change if necessary
                if (id === true && expanded !== this.state.expanded) {
                    this.setState({expanded});
                }
            }
        );
        this.subscribe(
            hierarchicalMappingChannel.subject('ruleView.change'),
            this.onOpenEdit
        );
        this.subscribe(
            hierarchicalMappingChannel.subject('ruleView.unchanged'),
            this.onCloseEdit
        );
        this.subscribe(
            hierarchicalMappingChannel.subject('ruleView.discardAll'),
            this.discardAll
        );
    },
    onOpenEdit(obj) {
        if (this.props.rule.id === obj.id) {
            this.setState({
                editing: true,
            });
        }
    },
    onCloseEdit(obj) {
        if (this.props.rule.id === obj.id) {
            this.setState({
                editing: false,
            });
        }
    },
    handleDiscardChanges() {
        this.setState({
            expanded: !this.state.expanded,
            askForDiscard: false,
        });
        hierarchicalMappingChannel
            .subject('ruleView.unchanged')
            .onNext({id: this.props.rule.id});
    },
    handleCancelDiscard() {
        this.setState({
            askForDiscard: false,
        });
    },
    handleToggleExpand() {
        if (this.state.editing) {
            this.setState({
                askForDiscard: true,
            });
        } else {
            this.setState({
                expanded: !this.state.expanded,
            });
        }
    },
    discardAll() {
        this.setState({
            editing: false,
        });
    },
    render() {
        if (_.isEmpty(this.props.rule)) {
            return false;
        }

        const discardView = this.state.askForDiscard
            ? <ConfirmationDialog
                  active
                  modal
                  title="Discard changes?"
                  confirmButton={
                      <DisruptiveButton
                          disabled={false}
                          onClick={this.handleDiscardChanges}>
                          Discard
                      </DisruptiveButton>
                  }
                  cancelButton={
                      <DismissiveButton onClick={this.handleCancelDiscard}>
                          Cancel
                      </DismissiveButton>
                  }>
                  <p>You currently have unsaved changes.</p>
              </ConfirmationDialog>
            : false;

        const breadcrumbs = _.get(this.props, 'rule.breadcrumbs', []);
        const parent = _.last(breadcrumbs);

        let content = false;

        if (this.state.expanded) {
            content = (
                <ObjectRule
                    {...this.props.rule}
                    parentId={_.get(parent, 'id', '')}
                    parent={parent}
                    edit={false}
                />
            );
        }

        return (
            <div className="ecc-silk-mapping__rulesobject">
                {discardView}
                <Card shadow={0}>
                    <CardTitle>
                        <div className="ecc-silk-mapping__ruleitem">
                            <div className={
                                    className(
                                        'ecc-silk-mapping__ruleitem-summary',
                                        {
                                            'ecc-silk-mapping__ruleitem-summary--expanded': this.state.expanded
                                        }
                                    )
                                }
                            >
                                <div
                                    className={'mdl-list__item clickable'}
                                    onClick={this.handleToggleExpand}
                                >
                                    <div className={'mdl-list__item-primary-content'}>
                                        <div className="ecc-silk-mapping__ruleitem-headline">
                                            <ThingIcon type={'object'} />
                                            <RuleTitle rule={this.props.rule} className="ecc-silk-mapping__rulesobject__title-property" />
                                        </div>
                                        <RuleTypes rule={this.props.rule} className="ecc-silk-mapping__ruleitem-subline ecc-silk-mapping__rulesobject__title-type" />
                                        <div className="ecc-silk-mapping__ruleitem-subline ecc-silk-mapping__rulesobject__title-uripattern">
                                            {
                                                _.has(this.props.rule.rules, ['uriRule', 'pattern'])
                                                ? this.props.rule.rules.uriRule.pattern
                                                : <NotAvailable
                                                    label="URI pattern not set"
                                                    inline={true}>
                                                  </NotAvailable>
                                            }
                                        </div>
                                    </div>
                                    <div className="mdl-list__item-secondary-content" key="action">
                                        <Button
                                            iconName={
                                                this.state.expanded
                                                    ? 'expand_less'
                                                    : 'expand_more'
                                            }
                                            onClick={ev => {
                                                this.handleToggleExpand();
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardTitle>
                    {content}
                </Card>
            </div>
        );
    },
});

export default MappingsObject;
