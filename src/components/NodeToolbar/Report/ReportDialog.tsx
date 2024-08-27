import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import { map } from 'lodash'

import { PlaceInfo, PlaceProperties } from '@sozialhelden/a11yjson'
import {
  accessibilityName,
  isWheelchairAccessible,
} from '../../../lib/Feature'
import { CategoryLookupTables } from '../../../lib/model/ac/categories/Categories'
import { AppContextData } from '../../../AppContext'

import strings from './strings'
import FixOsmComment from './FixOsmComment'
import MailToSupportLegacy from './MailToSupportLegacy'
import SendReportToAc, { reportStrings, ReportReasons } from './SendReportToAc'
import FixOsmPlacePosition from './FixOsmPlacePosition'
import FixOnExternalPage from './FixOnExternalPage'
import FixOsmNonExistingPlace from './FixOsmNonExistingPlace'
import WheelchairStatusEditor from '../AccessibilityEditor/WheelchairStatusEditor'
import ToiletStatusEditor from '../AccessibilityEditor/ToiletStatusEditor'
import {
  DataSource,
  dataSourceCache,
} from '../../../lib/cache/DataSourceCache'
import Spinner from '../../ActivityIndicator/Spinner'

type IssueEntry = {
  className?: string;
  issueHeader?: () => React.ReactNode;
  issueLink?: () => React.ReactNode;
  component?: React.ComponentType<any>;
};

const generateWheelmapClassicIssues = (
  properties: PlaceProperties,
): IssueEntry[] => [
  {
    className: 'wrong-wheelchair-accessibility',
    issueLink: () => {
      const accessibilityDescription = accessibilityName(isWheelchairAccessible(properties)) || ''
      // translator: Shown as issue description in the report dialog
      return t`The place is marked as ‘${accessibilityDescription}’, but this is wrong!`
    },
    component: WheelchairStatusEditor,
  },
  isWheelchairAccessible(properties) !== 'unknown'
    ? {
      className: 'wrong-toilet-accessibility',
      // translator: Shown as issue description in the report dialog
      issueLink: () => t`The toilet accessibility of the place is marked incorrectly or is missing.`,
      component: ToiletStatusEditor,
    }
    : null,
  {
    className: 'information-missing',
    // translator: Shown as issue description in the report dialog
    issueLink: () => t`I have more information about this place.`,
    component: FixOsmComment,
  },
  {
    className: 'non-existing-place',
    // translator: Shown as issue description in the report dialog
    issueLink: () => t`The place does not exist.`,
    component: FixOsmNonExistingPlace,
  },
  {
    className: 'wrong-position',
    // translator: Shown as issue description in the report dialog
    issueLink: () => t`The place is at the wrong location.`,
    component: FixOsmPlacePosition,
  },
  {
    className: 'other-issue',
    // translator: Shown as issue description in the report dialog
    issueLink: () => t`The problem isn’t listed here…`,
    component: MailToSupportLegacy,
  },
].filter(Boolean)

const generateAcIssues = (
  properties: PlaceProperties,
  appContext: AppContextData,
  source: DataSource | null,
  appToken: string,
): IssueEntry[] => {
  const isExternal = source && source.organizationId !== appContext.app.organizationId
  const hasExternalPage = Boolean(
    properties.infoPageUrl || properties.editPageUrl,
  )
  const sourceName = (source && (source.shortName || source.name)) || t`Unknown`

  const sendReportToAcStrings = reportStrings()

  return [
    isExternal
      ? {
        className: 'subtle',
        // translator: Gives credits to the external data source this place comes from.
        issueHeader: () => t`Information about this place has kindly been provided by another organization, it is a part of ${sourceName}.`,
      }
      : null,
    hasExternalPage
      ? {
        className: 'fix-on-external-page',
        // translator: Shown as issue description in the report dialog
        issueLink: () => t`Fix on external page.`,
        component: FixOnExternalPage,
      }
      : null,
    ...map(sendReportToAcStrings, (value, key: ReportReasons) => ({
      className: key,
      issueLink: () => value,
      component: (props: { featureId: string; onClose: () => void }) => (
        <SendReportToAc {...props} reportReason={key} appToken={appToken} />
      ),
    })),
    {
      className: 'other-issue',
      // translator: Shown as issue description in the report dialog
      issueLink: () => t`The problem isn’t listed here…`,
      component: MailToSupportLegacy,
    },
  ].filter(Boolean) as IssueEntry[]
}

type Props = {
  appContext: AppContextData;
  categories: CategoryLookupTables;
  feature: PlaceInfo;
  featureId: string | number | null;
  className?: string;
  onClose: () => void;
  onCloseButtonChanged?: () => void;
};

type State = {
  lastFeatureId: string | number | null;
  SelectedComponentClass: React.ComponentType<any> | null;
  source: DataSource | null;
};

class ReportDialog extends React.Component<Props, State> {
  props: Props

  state: State = {
    lastFeatureId: null,
    SelectedComponentClass: null,
    source: null,
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> {
    if (props.featureId !== state.lastFeatureId) {
      return {
        SelectedComponentClass: null,
        lastFeatureId: props.featureId,
        source: null,
      }
    }

    return null
  }

  componentDidMount() {}

  componentWillUnmount() {}

  generateIssues(
    _featureId: string | number,
    props: PlaceProperties,
    appToken: string,
  ) {
    if (!this.state.source) {
      dataSourceCache
        .getDataSourceWithId(props.sourceId, appToken)
        .then((source) => {
          this.setState({ source })
        })
    }

    return generateAcIssues(
      props,
      this.props.appContext,
      this.state.source,
      appToken,
    )
  }

  onClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (this.state.SelectedComponentClass) {
      this.setState({ SelectedComponentClass: null })
    } else if (this.props.onClose) {
      this.props.onClose()
    }
  }

  onSelectComponentClass = (
    component: React.ComponentType<any>,
    event: UIEvent,
  ) => {
    this.setState({ SelectedComponentClass: component })
    event.stopPropagation()
    event.preventDefault()
  }

  render() {
    const { featureId, feature, categories } = this.props
    const { backButtonCaption, reportIssueHeader } = strings()
    const { properties } = feature || {}

    if (!featureId || !feature || !properties) {
      return (
        <div
          className={this.props.className}
          role="dialog"
          aria-labelledby="report-dialog-header"
        >
          <header id="report-dialog-header">{reportIssueHeader}</header>
          <Spinner size={30} color="rgba(0, 0, 0, 0.4)" />
          <button
            className="link-button negative-button"
            onClick={this.onClose}
          >
            {backButtonCaption}
          </button>
        </div>
      )
    }

    const ComponentClass = this.state.SelectedComponentClass
    if (ComponentClass) {
      return (
        <ComponentClass
          categories={categories}
          feature={feature}
          properties={properties}
          featureId={featureId}
          onClose={this.onClose}
          inline
          source={this.state.source}
        />
      )
    }

    const issues = this.generateIssues(
      featureId,
      properties,
      this.props.appContext.app.tokenString,
    )

    return (
      <div
        className={this.props.className}
        role="dialog"
        aria-labelledby="report-dialog-header"
      >
        <header id="report-dialog-header">{reportIssueHeader}</header>
        <ul className="issue-types">
          {issues.map((issue, index) => {
            const link = issue.issueLink ? issue.issueLink() : null
            const header = issue.issueHeader ? issue.issueHeader() : null
            const { component } = issue
            return (
              <li
                key={issue.className || index}
                className={issue.className || ''}
              >
                {header && <p>{header}</p>}
                {link && component && (
                  <button
                    className="link-button full-width-button"
                    onClick={this.onSelectComponentClass.bind(this, component)}
                  >
                    {link}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
        <button className="link-button negative-button" onClick={this.onClose}>
          {backButtonCaption}
        </button>
      </div>
    )
  }
}

const StyledReportDialog = styled(ReportDialog)`
  header {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  ul.issue-types {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`

export default StyledReportDialog
