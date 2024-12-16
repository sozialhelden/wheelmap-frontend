import * as React from "react";
import styled from "styled-components";
import { t } from "ttag";

import FocusTrap from "focus-trap-react";
import type { CategoryLookupTables } from "../../../lib/Categories";
import type {
  AccessibilityCloudFeature,
  WheelmapFeature,
} from "../../../lib/Feature";
import getIconNameForProperties from "../../Map/getIconNameForProperties";
import StyledMarkdown from "../../StyledMarkdown";
import CustomRadio from "./CustomRadio";
import StyledRadioGroup from "./StyledRadioGroup";

type Props = {
	featureId: string | number;
	feature: WheelmapFeature | AccessibilityCloudFeature;
	categories: CategoryLookupTables;
	hideUnselectedCaptions?: boolean;

	onSave: (value: string) => void | null;
	onClose: () => void;

	inline?: boolean | null;
	shownStatusOptions: string[];
	presetStatus?: string | null;
	undefinedStringValue: string;
	renderChildrenForValue: (value: {
		value: string;
		categoryId: string;
	}) => React.ReactNode;
	getValueFromFeature: (
		feature: WheelmapFeature | AccessibilityCloudFeature,
	) => string;
	saveValue: (selectedValue: string) => Promise<any>;
	descriptionForValue: (value: string) => string;
	captionForValue: (value: string) => string;

	children: React.ReactNode;
	className?: string;
};

type State = {
	selectedValue: string | null;
	categoryId: string | null;
	busy: boolean;
};

function getSelectedValueFromProps(props: Props): string | null {
	if (!props.feature || !props.feature.properties) {
		return props.presetStatus;
	}

	const featureValue =
		props.getValueFromFeature(props.feature) || props.presetStatus;

	if (featureValue === props.undefinedStringValue) {
		return props.presetStatus || featureValue;
	}

	return featureValue;
}

class RadioStatusEditor extends React.Component<Props, State> {
	state: State = {
		categoryId: "other",
		selectedValue: null,
		busy: false,
	};

	constructor(props) {
		super(props);

		const selectedValue = getSelectedValueFromProps(props);

		if (selectedValue) {
			this.state = {
				...this.state,
				selectedValue,
				categoryId:
					this.fetchCategory(props.categories, props.feature) || "other",
			};
		}
	}

	// @TODO Refactor into util function.
	fetchCategory(categories: CategoryLookupTables, feature: WheelmapFeature) {
		if (!feature) {
			return;
		}
		const properties = feature.properties;
		if (!properties) {
			return;
		}

		const categoryId =
			(properties.node_type && properties.node_type.identifier) ||
			properties.category;

		if (!categoryId) {
			return;
		}

		return getIconNameForProperties(categories, properties);
	}

	onRadioGroupKeyDown = ({ nativeEvent }) => {
		if (nativeEvent.key === "Enter") {
			this.onSaveButtonClick(nativeEvent);
		}
	};

	onSaveButtonClick = (event) => {
		event.preventDefault();
		event.stopPropagation();

		const selectedValue = this.state.selectedValue;

		if (selectedValue && selectedValue !== this.props.undefinedStringValue) {
			this.props.saveValue(selectedValue);
			this.setState({ busy: true });
		}
	};

	closeButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (typeof this.props.onClose === "function") {
			this.props.onClose();
			// prevent clicking the next close button as well
			event.preventDefault();
			event.stopPropagation();
		}
	};

	renderRadioGroup() {
		const { selectedValue, busy } = this.state;
		const valueIsDefined = selectedValue !== "unknown";

		// translator: Screen reader description for the accessibility choice buttons in the wheelchair accessibility editor dialog
		const ariaLabel = t`Wheelchair accessibility`;

		return (
			<StyledRadioGroup
				name="accessibility"
				selectedValue={selectedValue}
				onChange={(newValue) => {
					this.setState({ selectedValue: newValue });
				}}
				className={`${selectedValue || ""} ${valueIsDefined ? "has-selection" : ""} radio-group`}
				onKeyDown={this.onRadioGroupKeyDown}
				role="radiogroup"
				aria-label={ariaLabel}
			>
				{this.props.shownStatusOptions.map((value, index) => (
					<CustomRadio
						key={String(value)}
						disabled={busy}
						children={this.props.renderChildrenForValue({
							value,
							categoryId: this.state.categoryId || "other",
						})}
						shownValue={value ? String(value) : null}
						currentValue={selectedValue ? String(selectedValue) : null}
						caption={this.props.captionForValue(value)}
						description={this.props.descriptionForValue(value)}
					/>
				))}
			</StyledRadioGroup>
		);
	}

	renderFooter() {
		// translator: Button caption shown while editing a place’s wheelchair status
		const confirmButtonCaption = t`Confirm`;

		// translator: Button caption shown while editing a place’s wheelchair status
		const changeButtonCaption = t`Change`;

		// translator: Button caption shown while editing a place’s wheelchair status
		const continueButtonCaption = t`Continue`;

		// translator: Button caption shown while editing a place’s wheelchair status
		const cancelButtonCaption = t`Cancel`;

		// translator: Button caption shown while editing a place’s wheelchair status
		const backButtonCaption = t`Back`;

		const selectedValue = getSelectedValueFromProps(this.props);
		const valueHasChanged = this.state.selectedValue !== selectedValue;
		const backOrCancelButtonCaption = valueHasChanged
			? cancelButtonCaption
			: backButtonCaption;
		const hasBeenUnknownBefore = selectedValue === "unknown";
		const isUnknown = this.state.selectedValue === "unknown";

		let saveButtonCaption = confirmButtonCaption;
		if (valueHasChanged) saveButtonCaption = changeButtonCaption;
		if (hasBeenUnknownBefore) saveButtonCaption = continueButtonCaption;

		const outageNotice = valueHasChanged && (
			<StyledMarkdown>
				{t`⚠️ OpenStreetMap has a <a href='https://community.openstreetmap.org/t/openstreetmap-org-currently-offline-operations-team-are-working-to-restore-15-december-2024-updated' target='_blank' rel='noopener noreferrer'>database problem</a> at the moment. If saving doesnʼt work, please check back later. Sorry for the inconvenience! Services are expected to be restored on Wednesday, Dec 16th.`}
			</StyledMarkdown>
		);
		return (<>
      <footer>{outageNotice}</footer>
			<footer>
				<button
					className={`link-button ${valueHasChanged ? "negative-button" : ""}`}
					onClick={this.closeButtonClick}
				>
					{backOrCancelButtonCaption}
				</button>
				<button
					className="link-button primary-button"
					disabled={isUnknown || this.state.busy}
					onClick={this.onSaveButtonClick}
				>
					{saveButtonCaption}
				</button>
			</footer>
		</>);
	}

	render() {
		return (
			<FocusTrap>
				<section
					className={[
						this.props.className,
						this.props.hideUnselectedCaptions && "hide-unselected-captions",
					]
						.filter(Boolean)
						.join(" ")}
					role="dialog"
					aria-labelledby="wheelchair-accessibility-header"
				>
					{this.props.children}
					{this.renderRadioGroup()}
					{this.renderFooter()}
				</section>
			</FocusTrap>
		);
	}
}

const StyledWheelchairStatusEditor = styled(RadioStatusEditor)`
  display: flex;
  flex-direction: column;
  margin: 0.5em 0 0 0;

  > header,
  footer {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: space-between;
  }

  footer {
    margin: 16px -8px 0px -8px;
  }

  figure {
    margin-right: 8px;
    top: 0;
    left: 0;
  }

  .close-link {
    top: 5px;
    right: 8px;
    position: absolute;
    background-color: transparent;
    display: flex;
    flex-direction: row-reverse;
  }

  @media (max-width: 414px) {
    &.hide-unselected-captions {
      .radio-group {
        label:not(.is-selected) {
          footer {
            display: none;
          }
        }
      }
    }
  }
`;

export default StyledWheelchairStatusEditor;
