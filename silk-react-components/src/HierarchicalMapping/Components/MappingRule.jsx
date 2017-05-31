/*
 An individual Mapping Rule Line
 */

import React from 'react';
import UseMessageBus from '../UseMessageBusMixin';
import {Button, ContextMenu, MenuItem} from 'ecc-gui-elements';
import hierarchicalMappingChannel from '../store';
import RuleValueEdit from './RuleValueEditView';
import RuleObjectEdit from './RuleObjectEditView';

const MappingRule = React.createClass({

    mixins: [UseMessageBus],

    // define property types
    propTypes: {
        comment: React.PropTypes.string,
        id: React.PropTypes.string,
        type: React.PropTypes.string, // mapping type
        typeRules: React.PropTypes.array,
        mappingTarget: React.PropTypes.object,
        sourcePath: React.PropTypes.string,
        targetProperty: React.PropTypes.string,
        pattern: React.PropTypes.string,
        uriRule: React.PropTypes.object,
        parent: React.PropTypes.bool,
    },

    // initilize state
    getInitialState() {
        // listen for event to expand / collapse mapping rule
        this.subscribe(hierarchicalMappingChannel.subject('rulesView.toggle'), ({expanded}) => {
            // only trigger state / render change if necessary
            if (expanded !== this.state.expanded && !this.props.parent) {
                this.setState({expanded});
            }
        });
        // listen to rule edit event

        return {
            expanded: false,
        };
    },
    // jumps to selected rule as new center of view
    handleNavigate() {
        hierarchicalMappingChannel.subject('ruleId.change').onNext({newRuleId: this.props.id});
    },
    // show / hide additional row details
    handleToggleExpand() {
        this.setState({expanded: !this.state.expanded});
    },
    // template rendering
    render () {
        const {
            id,
            type,
            parent,
        } = this.props;

        const action = (
            <Button
                iconName={type === 'object' && !parent ? 'arrow_nextpage' : (this.state.expanded ? 'expand_less' : 'expand_more')}
                tooltip={type === 'object' && !parent ? 'Navigate to' : undefined}
                onClick={(event) => {
                    if (type === 'object' && !parent) {
                        this.handleNavigate();
                    } else {
                        this.handleToggleExpand({force: true});
                    }
                    event.stopPropagation();
                }}
            />
        );

        const shortView = (
            <div>
                {id}
                <div className="mdl-list__item-text-body">
                    <div>
                        from (todo: get content after store implementation)
                    </div>
                    <div>
                        by (todo: get content after store implementation)
                    </div>
                </div>
            </div>
        );

        // FIXME: only show edit / remove buttons for non-object mappings?
        const expandedView = this.state.expanded ? (
            (type === 'object' || type === 'root') ? (
                <RuleObjectEdit
                    {...this.props}
                    type={type}
                    edit={false}
                />
            ) : (
                <RuleValueEdit
                    {...this.props}
                    type={type}
                    edit={false}
                />

            )
        ) : false;

        const reorderHandleButton = !this.state.expanded ? (
            <div
                className="ecc-silk-mapping__ruleitem-reorderhandler"
            >
                <ContextMenu
                    iconName="reorder"
                    align='left'
                    valign='top'
                >
                    <MenuItem>
                        Move to top
                    </MenuItem>
                    <MenuItem>
                        Move up
                    </MenuItem>
                    <MenuItem>
                        Move down
                    </MenuItem>
                    <MenuItem>
                        Move to bottom
                    </MenuItem>
                </ContextMenu>
            </div>
        ) : false;

        return (
            <li className={
                    "ecc-silk-mapping__ruleitem mdl-list__item " +
                    (type === 'object' ? 'ecc-silk-mapping__ruleitem--object' : 'ecc-silk-mapping__ruleitem--literal') +
                    (this.state.expanded ? ' ecc-silk-mapping__ruleitem--expanded' : '')
            }>
                {reorderHandleButton}
                <div className="mdl-list__item-primary-content">
                    {this.state.expanded ? expandedView : shortView}
                </div>
                <div className="mdl-list__item-secondary-content" key="action">
                    {action}
                </div>
            </li>
        );
    },
});

export default MappingRule;
