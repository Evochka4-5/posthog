import { TaxonomicFilterGroupType } from 'lib/components/TaxonomicFilter/types'

import {
    AnyFilterLike,
    AnyPersonScopeFilter,
    AnyPropertyFilter,
    BaseMathType,
    BreakdownKeyType,
    BreakdownType,
    ChartDisplayCategory,
    ChartDisplayType,
    CountPerActorMathType,
    EventPropertyFilter,
    EventType,
    FilterLogicalOperator,
    FilterType,
    FunnelMathType,
    FunnelsFilterType,
    GroupMathType,
    HogQLMathType,
    InsightShortId,
    InsightType,
    IntervalType,
    LifecycleFilterType,
    LifecycleToggle,
    LogEntryPropertyFilter,
    PathsFilterType,
    PersonPropertyFilter,
    PropertyFilterType,
    PropertyGroupFilter,
    PropertyMathType,
    PropertyOperator,
    RetentionFilterType,
    SessionPropertyFilter,
    SessionRecordingType,
    StickinessFilterType,
    TrendsFilterType,
} from '~/types'

export { ChartDisplayCategory }

// Type alias for number to be reflected as integer in json-schema.
/** @asType integer */
type integer = number

/**
 * PostHog Query Schema definition.
 *
 * This file acts as the source of truth for:
 *
 * - frontend/src/queries/schema.json
 *   - generated from typescript via "pnpm run schema:build:json"
 *
 * - posthog/schema.py
 *   - generated from json the above json via "pnpm run schema:build:python"
 * */

export enum NodeKind {
    // Data nodes
    EventsNode = 'EventsNode',
    ActionsNode = 'ActionsNode',
    DataWarehouseNode = 'DataWarehouseNode',
    EventsQuery = 'EventsQuery',
    PersonsNode = 'PersonsNode',
    HogQuery = 'HogQuery',
    HogQLQuery = 'HogQLQuery',
    HogQLMetadata = 'HogQLMetadata',
    HogQLAutocomplete = 'HogQLAutocomplete',
    ActorsQuery = 'ActorsQuery',
    FunnelsActorsQuery = 'FunnelsActorsQuery',
    FunnelCorrelationActorsQuery = 'FunnelCorrelationActorsQuery',
    SessionsTimelineQuery = 'SessionsTimelineQuery',
    RecordingsQuery = 'RecordingsQuery',
    SessionAttributionExplorerQuery = 'SessionAttributionExplorerQuery',
    ErrorTrackingQuery = 'ErrorTrackingQuery',

    // Interface nodes
    DataTableNode = 'DataTableNode',
    DataVisualizationNode = 'DataVisualizationNode',
    SavedInsightNode = 'SavedInsightNode',
    InsightVizNode = 'InsightVizNode',

    TrendsQuery = 'TrendsQuery',
    FunnelsQuery = 'FunnelsQuery',
    RetentionQuery = 'RetentionQuery',
    PathsQuery = 'PathsQuery',
    StickinessQuery = 'StickinessQuery',
    LifecycleQuery = 'LifecycleQuery',
    InsightActorsQuery = 'InsightActorsQuery',
    InsightActorsQueryOptions = 'InsightActorsQueryOptions',
    FunnelCorrelationQuery = 'FunnelCorrelationQuery',

    // Web analytics queries
    WebOverviewQuery = 'WebOverviewQuery',
    WebStatsTableQuery = 'WebStatsTableQuery',
    WebExternalClicksTableQuery = 'WebExternalClicksTableQuery',
    WebGoalsQuery = 'WebGoalsQuery',

    // Experiment queries
    ExperimentFunnelsQuery = 'ExperimentFunnelsQuery',
    ExperimentTrendsQuery = 'ExperimentTrendsQuery',

    // Database metadata
    DatabaseSchemaQuery = 'DatabaseSchemaQuery',

    // AI queries
    SuggestedQuestionsQuery = 'SuggestedQuestionsQuery',
    TeamTaxonomyQuery = 'TeamTaxonomyQuery',
    EventTaxonomyQuery = 'EventTaxonomyQuery',
    ActorsPropertyTaxonomyQuery = 'ActorsPropertyTaxonomyQuery',
}

export type AnyDataNode =
    | EventsNode // never queried directly
    | ActionsNode // old actions API endpoint
    | PersonsNode // old persons API endpoint
    | EventsQuery
    | ActorsQuery
    | InsightActorsQuery
    | InsightActorsQueryOptions
    | SessionsTimelineQuery
    | HogQuery
    | HogQLQuery
    | HogQLMetadata
    | HogQLAutocomplete
    | WebOverviewQuery
    | WebStatsTableQuery
    | WebExternalClicksTableQuery
    | WebGoalsQuery
    | SessionAttributionExplorerQuery
    | ErrorTrackingQuery
    | ExperimentFunnelsQuery
    | ExperimentTrendsQuery
    | RecordingsQuery

/**
 * @discriminator kind
 */
export type QuerySchema =
    // Data nodes (see utils.ts)
    | EventsNode // never queried directly
    | ActionsNode // old actions API endpoint
    | PersonsNode // old persons API endpoint
    | DataWarehouseNode
    | EventsQuery
    | ActorsQuery
    | InsightActorsQuery
    | InsightActorsQueryOptions
    | SessionsTimelineQuery
    | HogQuery
    | HogQLQuery
    | HogQLMetadata
    | HogQLAutocomplete
    | WebOverviewQuery
    | WebStatsTableQuery
    | WebExternalClicksTableQuery
    | WebGoalsQuery
    | SessionAttributionExplorerQuery
    | ErrorTrackingQuery
    | ExperimentFunnelsQuery
    | ExperimentTrendsQuery

    // Interface nodes
    | DataVisualizationNode
    | DataTableNode
    | SavedInsightNode
    | InsightVizNode

    // Classic insights
    | TrendsQuery
    | FunnelsQuery
    | RetentionQuery
    | PathsQuery
    | StickinessQuery
    | LifecycleQuery
    | FunnelCorrelationQuery

    // Misc
    | DatabaseSchemaQuery

    // AI
    | SuggestedQuestionsQuery
    | TeamTaxonomyQuery
    | EventTaxonomyQuery
    | ActorsPropertyTaxonomyQuery

// Keep this, because QuerySchema itself will be collapsed as it is used in other models
export type QuerySchemaRoot = QuerySchema

// Dynamically make a union type out of all the types in all `response` fields in QuerySchema
type QueryResponseType<T> = T extends { response?: infer R } ? { response: R } : never
type QueryAllResponses = QueryResponseType<QuerySchema>
export type QueryResponseAlternative = QueryAllResponses['response']

/**
 * Node base class, everything else inherits from here.
 * @internal - no need to emit to schema.json.
 */
export interface Node<R extends Record<string, any> = Record<string, any>> {
    kind: NodeKind
    /** @internal Don't use this property at runtime, it's here for typing. */
    response?: R
}

// Data nodes

export type AnyResponseType =
    | Record<string, any>
    | HogQueryResponse
    | HogQLQueryResponse
    | HogQLMetadataResponse
    | HogQLAutocompleteResponse
    | EventsNode['response']
    | EventsQueryResponse
    | ErrorTrackingQueryResponse

/** @internal - no need to emit to schema.json. */
export interface DataNode<R extends Record<string, any> = Record<string, any>> extends Node<R> {
    /** Modifiers used when performing the query */
    modifiers?: HogQLQueryModifiers
}

/** HogQL Query Options are automatically set per team. However, they can be overridden in the query. */
export interface HogQLQueryModifiers {
    personsOnEventsMode?:
        | 'disabled' // `disabled` is deprecated and set for removal - `person_id_override_properties_joined` is its faster functional equivalent
        | 'person_id_no_override_properties_on_events'
        | 'person_id_override_properties_on_events'
        | 'person_id_override_properties_joined'
    personsArgMaxVersion?: 'auto' | 'v1' | 'v2'
    inCohortVia?: 'auto' | 'leftjoin' | 'subquery' | 'leftjoin_conjoined'
    materializationMode?: 'auto' | 'legacy_null_as_string' | 'legacy_null_as_null' | 'disabled'
    optimizeJoinedFilters?: boolean
    dataWarehouseEventsModifiers?: DataWarehouseEventsModifier[]
    debug?: boolean
    s3TableUseInvalidColumns?: boolean
    personsJoinMode?: 'inner' | 'left'
    bounceRatePageViewMode?: 'count_pageviews' | 'uniq_urls' | 'uniq_page_screen_autocaptures'
    sessionTableVersion?: 'auto' | 'v1' | 'v2'
    propertyGroupsMode?: 'enabled' | 'disabled' | 'optimized'
    useMaterializedViews?: boolean
    customChannelTypeRules?: CustomChannelRule[]
}

export interface DataWarehouseEventsModifier {
    table_name: string
    timestamp_field: string
    distinct_id_field: string
    id_field: string
}

export interface HogQLQueryResponse extends AnalyticsQueryResponseBase<any[]> {
    /** Input query string */
    query?: string
    /** Executed ClickHouse query */
    clickhouse?: string
    /** Returned columns */
    columns?: any[]
    /** Types of returned columns */
    types?: any[]
    /** Query explanation output */
    explain?: string[]
    /** Query metadata output */
    metadata?: HogQLMetadataResponse
    hasMore?: boolean
    limit?: integer
    offset?: integer
}

export type CachedHogQLQueryResponse = CachedQueryResponse<HogQLQueryResponse>

/** Filters object that will be converted to a HogQL {filters} placeholder */
export interface HogQLFilters {
    properties?: AnyPropertyFilter[]
    dateRange?: DateRange
    filterTestAccounts?: boolean
}

export interface HogQLVariable {
    variableId: string
    code_name: string
    value?: any
}

export interface HogQLQuery extends DataNode<HogQLQueryResponse> {
    kind: NodeKind.HogQLQuery
    query: string
    filters?: HogQLFilters
    /** Variables to be subsituted into the query */
    variables?: Record<string, HogQLVariable>
    /** Constant values that can be referenced with the {placeholder} syntax in the query */
    values?: Record<string, any>
    /** @deprecated use modifiers.debug instead */
    explain?: boolean
}

export interface HogQueryResponse {
    results: any
    bytecode?: any[]
    coloredBytecode?: any[]
    stdout?: string
    query_status?: never
}

export interface HogQuery extends DataNode<HogQueryResponse> {
    kind: NodeKind.HogQuery
    code?: string
}

export interface RecordingsQueryResponse {
    results: SessionRecordingType[]
    has_next: boolean
}

export type RecordingOrder =
    | 'duration'
    | 'recording_duration'
    | 'inactive_seconds'
    | 'active_seconds'
    | 'start_time'
    | 'console_error_count'
    | 'click_count'
    | 'keypress_count'
    | 'mouse_activity_count'
    | 'activity_score'

export interface RecordingsQuery extends DataNode<RecordingsQueryResponse> {
    kind: NodeKind.RecordingsQuery
    /**
     * @default "-3d"
     * */
    date_from?: string | null
    date_to?: string | null
    events?: FilterType['events']
    actions?: FilterType['actions']
    properties?: AnyPropertyFilter[]
    console_log_filters?: LogEntryPropertyFilter[]
    having_predicates?: AnyPropertyFilter[] // duration and snapshot_source filters
    filter_test_accounts?: boolean
    /**
     * @default "AND"
     * */
    operand?: FilterLogicalOperator
    session_ids?: string[]
    person_uuid?: string
    /**
     * @default "start_time"
     * */
    order?: RecordingOrder
    limit?: integer
    offset?: integer
    user_modified_filters?: Record<string, any>
}

export interface HogQLNotice {
    start?: integer
    end?: integer
    message: string
    fix?: string
}

export interface HogQLMetadataResponse {
    query?: string
    isValid?: boolean
    isValidView?: boolean
    errors: HogQLNotice[]
    warnings: HogQLNotice[]
    notices: HogQLNotice[]
    query_status?: never
    table_names?: string[]
}

export type AutocompleteCompletionItemKind =
    | 'Method'
    | 'Function'
    | 'Constructor'
    | 'Field'
    | 'Variable'
    | 'Class'
    | 'Struct'
    | 'Interface'
    | 'Module'
    | 'Property'
    | 'Event'
    | 'Operator'
    | 'Unit'
    | 'Value'
    | 'Constant'
    | 'Enum'
    | 'EnumMember'
    | 'Keyword'
    | 'Text'
    | 'Color'
    | 'File'
    | 'Reference'
    | 'Customcolor'
    | 'Folder'
    | 'TypeParameter'
    | 'User'
    | 'Issue'
    | 'Snippet'

export interface AutocompleteCompletionItem {
    /**
     * The label of this completion item. By default
     * this is also the text that is inserted when selecting
     * this completion.
     */
    label: string
    /**
     * A human-readable string that represents a doc-comment.
     */
    documentation?: string
    /**
     * A human-readable string with additional information
     * about this item, like type or symbol information.
     */
    detail?: string
    /**
     * A string or snippet that should be inserted in a document when selecting
     * this completion.
     */
    insertText: string
    /**
     * The kind of this completion item. Based on the kind
     * an icon is chosen by the editor.
     */
    kind: AutocompleteCompletionItemKind
}

export interface HogQLAutocompleteResponse {
    suggestions: AutocompleteCompletionItem[]
    /** Whether or not the suggestions returned are complete */
    incomplete_list: boolean
    /** Measured timings for different parts of the query generation process */
    timings?: QueryTiming[]
    query_status?: never
}

export enum HogLanguage {
    hog = 'hog',
    hogJson = 'hogJson',
    hogQL = 'hogQL',
    hogQLExpr = 'hogQLExpr',
    hogTemplate = 'hogTemplate',
}

export interface HogQLMetadata extends DataNode<HogQLMetadataResponse> {
    kind: NodeKind.HogQLMetadata
    /** Language to validate */
    language: HogLanguage
    /** Query to validate */
    query: string
    /** Query within which "expr" and "template" are validated. Defaults to "select * from events" */
    sourceQuery?: AnyDataNode
    /** Extra globals for the query */
    globals?: Record<string, any>
    /** Extra filters applied to query via {filters} */
    filters?: HogQLFilters
    /** Variables to be subsituted into the query */
    variables?: Record<string, HogQLVariable>
    /** Enable more verbose output, usually run from the /debug page */
    debug?: boolean
}

export interface HogQLAutocomplete extends DataNode<HogQLAutocompleteResponse> {
    kind: NodeKind.HogQLAutocomplete
    /** Language to validate */
    language: HogLanguage
    /** Query to validate */
    query: string
    /** Query in whose context to validate. */
    sourceQuery?: AnyDataNode
    /** Global values in scope */
    globals?: Record<string, any>
    /** Table to validate the expression against */
    filters?: HogQLFilters
    /**
     * Start position of the editor word
     */
    startPosition: integer
    /**
     * End position of the editor word
     */
    endPosition: integer
}

export type MathType =
    | BaseMathType
    | FunnelMathType
    | PropertyMathType
    | CountPerActorMathType
    | GroupMathType
    | HogQLMathType

export interface EntityNode extends Node {
    name?: string
    custom_name?: string
    math?: MathType
    math_property?: string
    math_property_type?: string
    math_hogql?: string
    math_group_type_index?: 0 | 1 | 2 | 3 | 4
    /** Properties configurable in the interface */
    properties?: AnyPropertyFilter[]
    /** Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person) */
    fixedProperties?: AnyPropertyFilter[]
}

export interface EventsNode extends EntityNode {
    kind: NodeKind.EventsNode
    /** The event or `null` for all events. */
    event?: string | null
    limit?: integer
    /** Columns to order by */
    orderBy?: string[]
}

export interface DataWarehouseNode extends EntityNode {
    id: string
    kind: NodeKind.DataWarehouseNode
    id_field: string
    table_name: string
    timestamp_field: string
    distinct_id_field: string
}

export interface ActionsNode extends EntityNode {
    kind: NodeKind.ActionsNode
    id: integer
}

export type AnyEntityNode = EventsNode | ActionsNode | DataWarehouseNode

export interface QueryTiming {
    /** Key. Shortened to 'k' to save on data. */
    k: string
    /** Time in seconds. Shortened to 't' to save on data. */
    t: number
}
export interface EventsQueryResponse extends AnalyticsQueryResponseBase<any[][]> {
    columns: any[]
    types: string[]
    hogql: string
    hasMore?: boolean
    limit?: integer
    offset?: integer
}

export type CachedEventsQueryResponse = CachedQueryResponse<EventsQueryResponse>

export interface EventsQueryPersonColumn {
    uuid: string
    created_at: string
    properties: {
        name?: string
        email?: string
    }
    distinct_id: string
}
export interface EventsQuery extends DataNode<EventsQueryResponse> {
    kind: NodeKind.EventsQuery
    /** Return a limited set of data. Required. */
    select: HogQLExpression[]
    /** HogQL filters to apply on returned data */
    where?: HogQLExpression[]
    /** Properties configurable in the interface */
    properties?: AnyPropertyFilter[]
    /** Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person) */
    fixedProperties?: AnyFilterLike[]
    /** Filter test accounts */
    filterTestAccounts?: boolean
    /** Limit to events matching this string */
    event?: string | null
    /**
     * Number of rows to return
     */
    limit?: integer
    /**
     * Number of rows to skip before returning rows
     */
    offset?: integer
    /**
     * Show events matching a given action
     */
    actionId?: integer
    /** Show events for a given person */
    personId?: string
    /** Only fetch events that happened before this timestamp */
    before?: string
    /** Only fetch events that happened after this timestamp */
    after?: string
    /** Columns to order by */
    orderBy?: string[]
}

/**
 * @deprecated Use `ActorsQuery` instead.
 */
export interface PersonsNode extends DataNode {
    kind: NodeKind.PersonsNode
    search?: string
    cohort?: integer
    distinctId?: string
    /** Properties configurable in the interface */
    properties?: AnyPropertyFilter[]
    /** Fixed properties in the query, can't be edited in the interface (e.g. scoping down by person) */
    fixedProperties?: AnyPropertyFilter[]
    limit?: integer
    offset?: integer
}

// Data table node

export type HasPropertiesNode = EventsNode | EventsQuery | PersonsNode

export interface DataTableNode
    extends Node<
            NonNullable<
                (
                    | EventsNode
                    | EventsQuery
                    | PersonsNode
                    | ActorsQuery
                    | HogQLQuery
                    | WebOverviewQuery
                    | WebStatsTableQuery
                    | WebExternalClicksTableQuery
                    | WebGoalsQuery
                    | SessionAttributionExplorerQuery
                    | ErrorTrackingQuery
                    | ExperimentFunnelsQuery
                    | ExperimentTrendsQuery
                )['response']
            >
        >,
        DataTableNodeViewProps {
    kind: NodeKind.DataTableNode
    /** Source of the events */
    source:
        | EventsNode
        | EventsQuery
        | PersonsNode
        | ActorsQuery
        | HogQLQuery
        | WebOverviewQuery
        | WebStatsTableQuery
        | WebExternalClicksTableQuery
        | WebGoalsQuery
        | SessionAttributionExplorerQuery
        | ErrorTrackingQuery
        | ExperimentFunnelsQuery
        | ExperimentTrendsQuery
    /** Columns shown in the table, unless the `source` provides them. */
    columns?: HogQLExpression[]
    /** Columns that aren't shown in the table, even if in columns or returned data */
    hiddenColumns?: HogQLExpression[]
}

export interface GoalLine {
    label: string
    value: number
}

export interface ChartAxis {
    column: string
    settings?: {
        formatting?: ChartSettingsFormatting
        display?: ChartSettingsDisplay
    }
}

export interface ChartSettingsFormatting {
    prefix?: string
    suffix?: string
    style?: 'none' | 'number' | 'percent'
    decimalPlaces?: number
}

export interface ChartSettingsDisplay {
    color?: string
    label?: string
    trendLine?: boolean
    yAxisPosition?: 'left' | 'right'
    displayType?: 'auto' | 'line' | 'bar'
}

export interface YAxisSettings {
    scale?: 'linear' | 'logarithmic'
    /** Whether the Y axis should start at zero */
    startAtZero?: boolean
}
export interface ChartSettings {
    xAxis?: ChartAxis
    yAxis?: ChartAxis[]
    goalLines?: GoalLine[]
    /** Deprecated: use `[left|right]YAxisSettings`. Whether the Y axis should start at zero */
    yAxisAtZero?: boolean
    leftYAxisSettings?: YAxisSettings
    rightYAxisSettings?: YAxisSettings
    /** Whether we fill the bars to 100% in stacked mode */
    stackBars100?: boolean
    seriesBreakdownColumn?: string | null
}

export interface ConditionalFormattingRule {
    id: string
    templateId: string
    columnName: string
    bytecode: any[]
    input: string
    color: string
    colorMode?: 'light' | 'dark'
}

export interface TableSettings {
    columns?: ChartAxis[]
    conditionalFormatting?: ConditionalFormattingRule[]
}

export interface DataVisualizationNode extends Node<never> {
    kind: NodeKind.DataVisualizationNode
    source: HogQLQuery
    display?: ChartDisplayType
    chartSettings?: ChartSettings
    tableSettings?: TableSettings
}

interface DataTableNodeViewProps {
    /** Show with most visual options enabled. Used in scenes. */ full?: boolean
    /** Include an event filter above the table (EventsNode only) */
    showEventFilter?: boolean
    /** Include a free text search field (PersonsNode only) */
    showSearch?: boolean
    /** Include a property filter above the table */
    showPropertyFilter?: boolean | TaxonomicFilterGroupType[]
    /** Show filter to exclude test accounts */
    showTestAccountFilters?: boolean
    /** Include a HogQL query editor above HogQL tables */
    showHogQLEditor?: boolean
    /** Show the kebab menu at the end of the row */
    showActions?: boolean
    /** Show date range selector */
    showDateRange?: boolean
    /** Show the export button */
    showExport?: boolean
    /** Show a reload button */
    showReload?: boolean
    /** Show the time it takes to run a query */
    showElapsedTime?: boolean
    /** Show a detailed query timing breakdown */
    showTimings?: boolean
    /** Show a button to configure the table's columns if possible */
    showColumnConfigurator?: boolean
    /** Show a button to configure and persist the table's default columns if possible */
    showPersistentColumnConfigurator?: boolean
    /** Shows a list of saved queries */
    showSavedQueries?: boolean
    /** Can expand row to show raw event data (default: true) */
    expandable?: boolean
    /** Link properties via the URL (default: false) */
    propertiesViaUrl?: boolean
    /** Can the user click on column headers to sort the table? (default: true) */
    allowSorting?: boolean
    /** Show a button to open the current query as a new insight. (default: true) */
    showOpenEditorButton?: boolean
    /** Show a results table */
    showResultsTable?: boolean
    /** Uses the embedded version of LemonTable */
    embedded?: boolean
}

// Saved insight node

export interface SavedInsightNode extends Node<never>, InsightVizNodeViewProps, DataTableNodeViewProps {
    kind: NodeKind.SavedInsightNode
    shortId: InsightShortId
}

// Insight viz node

/** Chart specific rendering options.
 * Use ChartRenderingMetadata for non-serializable values, e.g. onClick handlers
 * @see ChartRenderingMetadata
 * **/
export interface VizSpecificOptions {
    [InsightType.RETENTION]?: {
        hideLineGraph?: boolean
        hideSizeColumn?: boolean
        useSmallLayout?: boolean
    }
    [ChartDisplayType.ActionsPie]?: {
        disableHoverOffset?: boolean
        hideAggregation?: boolean
    }
}

export interface InsightVizNode<T = InsightQueryNode> extends Node<never>, InsightVizNodeViewProps {
    kind: NodeKind.InsightVizNode
    source: T
}

interface InsightVizNodeViewProps {
    /** Show with most visual options enabled. Used in insight scene. */
    full?: boolean
    showHeader?: boolean
    showTable?: boolean
    showCorrelationTable?: boolean
    showLastComputation?: boolean
    showLastComputationRefresh?: boolean
    showFilters?: boolean
    showResults?: boolean
    /** Query is embedded inside another bordered component */
    embedded?: boolean
    suppressSessionAnalysisWarning?: boolean
    hidePersonsModal?: boolean
    vizSpecificOptions?: VizSpecificOptions
}

/** Base class for insight query nodes. Should not be used directly. */
export interface InsightsQueryBase<R extends AnalyticsQueryResponseBase<any>> extends Node<R> {
    /** Date range for the query */
    dateRange?: DateRange
    /**
     * Exclude internal and test users by applying the respective filters
     *
     * @default false
     */
    filterTestAccounts?: boolean
    /**
     * Property filters for all series
     *
     * @default []
     */
    properties?: AnyPropertyFilter[] | PropertyGroupFilter
    /**
     * Groups aggregation
     */
    aggregation_group_type_index?: integer | null
    /** Sampling rate */
    samplingFactor?: number | null
    /** Modifiers used when performing the query */
    modifiers?: HogQLQueryModifiers
}

/** `TrendsFilterType` minus everything inherited from `FilterType` and `shown_as` */
export type TrendsFilterLegacy = Omit<TrendsFilterType, keyof FilterType | 'shown_as'>

export type TrendsFilter = {
    /** @default 1 */
    smoothingIntervals?: integer
    formula?: TrendsFilterLegacy['formula']
    /** @default ActionsLineGraph */
    display?: TrendsFilterLegacy['display']
    /** @default false */
    showLegend?: TrendsFilterLegacy['show_legend']
    /** @default false */
    showAlertThresholdLines?: boolean
    breakdown_histogram_bin_count?: TrendsFilterLegacy['breakdown_histogram_bin_count'] // TODO: fully move into BreakdownFilter
    /** @default numeric */
    aggregationAxisFormat?: TrendsFilterLegacy['aggregation_axis_format']
    aggregationAxisPrefix?: TrendsFilterLegacy['aggregation_axis_prefix']
    aggregationAxisPostfix?: TrendsFilterLegacy['aggregation_axis_postfix']
    decimalPlaces?: TrendsFilterLegacy['decimal_places']
    /** @default false */
    showValuesOnSeries?: TrendsFilterLegacy['show_values_on_series']
    showLabelsOnSeries?: TrendsFilterLegacy['show_labels_on_series']
    /** @default false */
    showPercentStackView?: TrendsFilterLegacy['show_percent_stack_view']
    yAxisScaleType?: TrendsFilterLegacy['y_axis_scale_type']
    hiddenLegendIndexes?: integer[]
}

export const TRENDS_FILTER_PROPERTIES = new Set<keyof TrendsFilter>([
    'smoothingIntervals',
    'formula',
    'display',
    'showLegend',
    'breakdown_histogram_bin_count',
    'aggregationAxisFormat',
    'aggregationAxisPrefix',
    'aggregationAxisPostfix',
    'decimalPlaces',
    'showValuesOnSeries',
    'showLabelsOnSeries',
    'showPercentStackView',
    'yAxisScaleType',
    'hiddenLegendIndexes',
])

export interface TrendsQueryResponse extends AnalyticsQueryResponseBase<Record<string, any>[]> {
    /** Wether more breakdown values are available. */
    hasMore?: boolean
}

export type CachedTrendsQueryResponse = CachedQueryResponse<TrendsQueryResponse>

export interface TrendsQuery extends InsightsQueryBase<TrendsQueryResponse> {
    kind: NodeKind.TrendsQuery
    /**
     * Granularity of the response. Can be one of `hour`, `day`, `week` or `month`
     *
     * @default day
     */
    interval?: IntervalType
    /** Events and actions to include */
    series: AnyEntityNode[]
    /** Properties specific to the trends insight */
    trendsFilter?: TrendsFilter
    /** Breakdown of the events and actions */
    breakdownFilter?: BreakdownFilter
    /** Compare to date range */
    compareFilter?: CompareFilter
    /**  Whether we should be comparing against a specific conversion goal */
    conversionGoal?: WebAnalyticsConversionGoal | null
}

export type AssistantArrayPropertyFilterOperator = PropertyOperator.Exact | PropertyOperator.IsNot
export interface AssistantArrayPropertyFilter {
    /**
     * `exact` - exact match of any of the values.
     * `is_not` - does not match any of the values.
     */
    operator: AssistantArrayPropertyFilterOperator
    /**
     * Only use property values from the plan. Always use strings as values. If you have a number, convert it to a string first. If you have a boolean, convert it to a string "true" or "false".
     */
    value: string[]
}

export type AssistantSetPropertyFilterOperator = PropertyOperator.IsSet | PropertyOperator.IsNotSet

export interface AssistantSetPropertyFilter {
    /**
     * `is_set` - the property has any value.
     * `is_not_set` - the property doesn't have a value or wasn't collected.
     */
    operator: AssistantSetPropertyFilterOperator
}

export type AssistantSingleValuePropertyFilterOperator =
    | PropertyOperator.Exact
    | PropertyOperator.IsNot
    | PropertyOperator.IContains
    | PropertyOperator.NotIContains
    | PropertyOperator.Regex
    | PropertyOperator.NotRegex

export interface AssistantSingleValuePropertyFilter {
    /**
     * `icontains` - case insensitive contains.
     * `not_icontains` - case insensitive does not contain.
     * `regex` - matches the regex pattern.
     * `not_regex` - does not match the regex pattern.
     */
    operator: AssistantSingleValuePropertyFilterOperator
    /**
     * Only use property values from the plan. If the operator is `regex` or `not_regex`, the value must be a valid ClickHouse regex pattern to match against.
     * Otherwise, the value must be a substring that will be matched against the property value.
     */
    value: string
}

export type AssistantStringNumberOrBooleanPropertyFilter =
    | AssistantSingleValuePropertyFilter
    | AssistantArrayPropertyFilter

export type AssistantDateTimePropertyFilterOperator =
    | PropertyOperator.IsDateExact
    | PropertyOperator.IsDateBefore
    | PropertyOperator.IsDateAfter

export interface AssistantDateTimePropertyFilter {
    operator: AssistantDateTimePropertyFilterOperator
    /**
     * Value must be a date in ISO 8601 format.
     */
    value: string
}

export type AssistantBasePropertyFilter =
    | AssistantStringNumberOrBooleanPropertyFilter
    | AssistantDateTimePropertyFilter
    | AssistantSetPropertyFilter

export type AssistantGenericPropertyFilter = AssistantBasePropertyFilter & {
    type: PropertyFilterType.Event | PropertyFilterType.Person | PropertyFilterType.Session | PropertyFilterType.Feature
    /**
     * Use one of the properties the user has provided in the plan.
     */
    key: string
}

export type AssistantGroupPropertyFilter = AssistantBasePropertyFilter & {
    type: PropertyFilterType.Group
    /**
     * Use one of the properties the user has provided in the plan.
     */
    key: string
    /**
     * Index of the group type from the group mapping.
     */
    group_type_index: integer
}

export type AssistantPropertyFilter = AssistantGenericPropertyFilter | AssistantGroupPropertyFilter

export interface AssistantInsightsQueryBase {
    /**
     * Date range for the query
     */
    dateRange?: DateRange

    /**
     * Exclude internal and test users by applying the respective filters
     *
     * @default false
     */
    filterTestAccounts?: boolean

    /**
     * Property filters for all series
     *
     * @default []
     */
    properties?: AssistantPropertyFilter[]

    /**
     * Sampling rate from 0 to 1 where 1 is 100% of the data.
     */
    samplingFactor?: number | null
}

export interface AssistantTrendsEventsNode
    extends Omit<EventsNode, 'fixedProperties' | 'properties' | 'math_hogql' | 'limit' | 'groupBy'> {
    properties?: AssistantPropertyFilter[]
}

export interface AssistantBaseMultipleBreakdownFilter {
    /**
     * Property name from the plan to break down by.
     */
    property: string
}

export interface AssistantGroupMultipleBreakdownFilter extends AssistantBaseMultipleBreakdownFilter {
    type: 'group'
    /**
     * Index of the group type from the group mapping.
     */
    group_type_index?: integer | null
}

export type AssistantEventMultipleBreakdownFilterType = Exclude<MultipleBreakdownType, 'group'>

export interface AssistantGenericMultipleBreakdownFilter extends AssistantBaseMultipleBreakdownFilter {
    type: AssistantEventMultipleBreakdownFilterType
}

export type AssistantMultipleBreakdownFilter =
    | AssistantGroupMultipleBreakdownFilter
    | AssistantGenericMultipleBreakdownFilter

export interface AssistantBreakdownFilter {
    /**
     * How many distinct values to show.
     * @default 25
     */
    breakdown_limit?: integer
}

export interface AssistantTrendsBreakdownFilter extends AssistantBreakdownFilter {
    /**
     * Use this field to define breakdowns.
     * @maxLength 3
     */
    breakdowns: AssistantMultipleBreakdownFilter[]
}

// Remove deprecated display types.
export type AssistantTrendsDisplayType = Exclude<TrendsFilterLegacy['display'], 'ActionsStackedBar'>

export interface AssistantTrendsFilter {
    /**
     * If the formula is provided, apply it here.
     */
    formula?: TrendsFilterLegacy['formula']

    /**
     * Visualization type. Available values:
     * `ActionsLineGraph` - time-series line chart; most common option, as it shows change over time.
     * `ActionsBar` - time-series bar chart.
     * `ActionsAreaGraph` - time-series area chart.
     * `ActionsLineGraphCumulative` - cumulative time-series line chart; good for cumulative metrics.
     * `BoldNumber` - total value single large number. You can't use this with breakdown; use when user explicitly asks for a single output number.
     * `ActionsBarValue` - total value (NOT time-series) bar chart; good for categorical data.
     * `ActionsPie` - total value pie chart; good for visualizing proportions.
     * `ActionsTable` - total value table; good when using breakdown to list users or other entities.
     * `WorldMap` - total value world map; use when breaking down by country name using property `$geoip_country_name`, and only then.
     * @default ActionsLineGraph
     */
    display?: AssistantTrendsDisplayType

    /**
     * Whether to show the legend describing series and breakdowns.
     * @default false
     */
    showLegend?: TrendsFilterLegacy['show_legend']

    /**
     * Formats the trends value axis. Do not use the formatting unless you are absolutely sure that formatting will match the data.
     * `numeric` - no formatting. Prefer this option by default.
     * `duration` - formats the value in seconds to a human-readable duration, e.g., `132` becomes `2 minutes 12 seconds`. Use this option only if you are sure that the values are in seconds.
     * `duration_ms` - formats the value in miliseconds to a human-readable duration, e.g., `1050` becomes `1 second 50 milliseconds`. Use this option only if you are sure that the values are in miliseconds.
     * `percentage` - adds a percentage sign to the value, e.g., `50` becomes `50%`.
     * `percentage_scaled` - formats the value as a percentage scaled to 0-100, e.g., `0.5` becomes `50%`.
     * @default numeric
     */
    aggregationAxisFormat?: TrendsFilterLegacy['aggregation_axis_format']

    /**
     * Custom prefix to add to the aggregation axis, e.g., `$` for USD dollars. You may need to add a space after prefix.
     */
    aggregationAxisPrefix?: TrendsFilterLegacy['aggregation_axis_prefix']

    /**
     * Custom postfix to add to the aggregation axis, e.g., ` clicks` to format 5 as `5 clicks`. You may need to add a space before postfix.
     */
    aggregationAxisPostfix?: TrendsFilterLegacy['aggregation_axis_postfix']

    /**
     * Number of decimal places to show. Do not add this unless you are sure that values will have a decimal point.
     */
    decimalPlaces?: TrendsFilterLegacy['decimal_places']

    /**
     * Whether to show a value on each data point.
     * @default false
     */
    showValuesOnSeries?: TrendsFilterLegacy['show_values_on_series']

    /**
     * Whether to show a percentage of each series. Use only with
     * @default false
     */
    showPercentStackView?: TrendsFilterLegacy['show_percent_stack_view']

    /**
     * Whether to scale the y-axis.
     * @default linear
     */
    yAxisScaleType?: TrendsFilterLegacy['y_axis_scale_type']
}

export interface CompareFilter {
    /**
     * Whether to compare the current date range to a previous date range.
     * @default false
     */
    compare?: boolean

    /**
     * The date range to compare to. The value is a relative date. Examples of relative dates are: `-1y` for 1 year ago, `-14m` for 14 months ago, `-100w` for 100 weeks ago, `-14d` for 14 days ago, `-30h` for 30 hours ago.
     */
    compare_to?: string
}

export interface AssistantTrendsQuery extends AssistantInsightsQueryBase {
    kind: NodeKind.TrendsQuery

    /**
     * Granularity of the response. Can be one of `hour`, `day`, `week` or `month`
     *
     * @default day
     */
    interval?: IntervalType

    /**
     * Events to include
     */
    series: AssistantTrendsEventsNode[]

    /**
     * Properties specific to the trends insight
     */
    trendsFilter?: AssistantTrendsFilter

    /**
     * Breakdown of the events
     */
    breakdownFilter?: AssistantTrendsBreakdownFilter

    /**
     * Compare to date range
     */
    compareFilter?: CompareFilter
}

export type AssistantTrendsMath = FunnelMathType.FirstTimeForUser | FunnelMathType.FirstTimeForUserWithFilters

export interface AssistantFunnelsEventsNode extends Node {
    kind: NodeKind.EventsNode
    /**
     * Name of the event.
     */
    event: string
    /**
     * Optional custom name for the event if it is needed to be renamed.
     */
    custom_name?: string
    /**
     * Optional math aggregation type for the series. Only specify this math type if the user wants one of these.
     * `first_time_for_user` - counts the number of users who have completed the event for the first time ever.
     * `first_time_for_user_with_filters` - counts the number of users who have completed the event with specified filters for the first time.
     */
    math?: AssistantTrendsMath
    properties?: AssistantPropertyFilter[]
}

/**
 * Exclustion steps for funnels. The "from" and "to" steps must not exceed the funnel's series length.
 */
export interface AssistantFunnelsExclusionEventsNode extends FunnelExclusionSteps {
    kind: NodeKind.EventsNode
    event: string
}

export interface AssistantFunnelsFilter {
    /**
     * Defines the behavior of event matching between steps. Prefer the `strict` option unless explicitly told to use a different one.
     * `ordered` - defines a sequential funnel. Step B must happen after Step A, but any number of events can happen between A and B.
     * `strict` - defines a funnel where all events must happen in order. Step B must happen directly after Step A without any events in between.
     * `any` - order doesn't matter. Steps can be completed in any sequence.
     * @default ordered
     */
    funnelOrderType?: FunnelsFilterLegacy['funnel_order_type']
    /**
     * Defines the type of visualization to use. The `steps` option is recommended.
     * `steps` - shows a step-by-step funnel. Perfect to show a conversion rate of a sequence of events (default).
     * `time_to_convert` - shows a histogram of the time it took to complete the funnel. Use this if the user asks about the average time it takes to complete the funnel.
     * `trends` - shows a trend of the whole sequence's conversion rate over time. Use this if the user wants to see how the conversion rate changes over time.
     * @default steps
     */
    funnelVizType?: FunnelsFilterLegacy['funnel_viz_type']
    /**
     * Users may want to use exclusion events to filter out conversions in which a particular event occurred between specific steps. These events must not be included in the main sequence.
     * You must include start and end indexes for each exclusion where the minimum index is one and the maximum index is the number of steps in the funnel.
     * For example, there is a sequence with three steps: sign up, finish onboarding, purchase. If the user wants to exclude all conversions in which users left the page before finishing the onboarding, the exclusion step would be the event `$pageleave` with start index 2 and end index 3.
     * @default []
     */
    exclusions?: AssistantFunnelsExclusionEventsNode[]
    /**
     * Controls how the funnel chart is displayed: vertically (preferred) or horizontally.
     * @default vertical
     */
    layout?: FunnelsFilterLegacy['layout']
    /**
     * Use this setting only when `funnelVizType` is `time_to_convert`: number of bins to show in histogram.
     * @asType integer
     */
    binCount?: FunnelsFilterLegacy['bin_count']
    /**
     * Controls a time frame value for a conversion to be considered. Select a reasonable value based on the user's query. Use in combination with `funnelWindowIntervalUnit`. The default value is 14 days.
     * @default 14
     */
    funnelWindowInterval?: integer
    /**
     * Controls a time frame interval for a conversion to be considered. Select a reasonable value based on the user's query. Use in combination with `funnelWindowInterval`. The default value is 14 days.
     * @default day
     */
    funnelWindowIntervalUnit?: FunnelsFilterLegacy['funnel_window_interval_unit']
    /**
     * Whether conversion shown in the graph should be across all steps or just relative to the previous step.
     * @default total
     */
    funnelStepReference?: FunnelsFilterLegacy['funnel_step_reference']
    /**
     * Use this field only if the user explicitly asks to aggregate the funnel by unique sessions.
     */
    funnelAggregateByHogQL?: 'properties.$session_id'
}

export type AssistantFunnelsBreakdownType = Extract<BreakdownType, 'person' | 'event' | 'group' | 'session'>

export interface AssistantFunnelsBreakdownFilter extends AssistantBreakdownFilter {
    /**
     * Type of the entity to break down by. If `group` is used, you must also provide `breakdown_group_type_index` from the group mapping.
     * @default event
     */
    breakdown_type: AssistantFunnelsBreakdownType
    /**
     * The entity property to break down by.
     */
    breakdown: string
    /**
     * If `breakdown_type` is `group`, this is the index of the group. Use the index from the group mapping.
     */
    breakdown_group_type_index?: integer | null
}

export interface AssistantFunnelsQuery extends AssistantInsightsQueryBase {
    kind: NodeKind.FunnelsQuery
    /**
     * Granularity of the response. Can be one of `hour`, `day`, `week` or `month`
     */
    interval?: IntervalType
    /**
     * Events to include
     */
    series: AssistantFunnelsEventsNode[]
    /**
     * Properties specific to the funnels insight
     */
    funnelsFilter?: AssistantFunnelsFilter
    /**
     * Breakdown the chart by a property
     */
    breakdownFilter?: AssistantFunnelsBreakdownFilter
    /**
     * Use this field to define the aggregation by a specific group from the group mapping that the user has provided.
     */
    aggregation_group_type_index?: integer
}

/** `FunnelsFilterType` minus everything inherited from `FilterType` and persons modal related params */
export type FunnelsFilterLegacy = Omit<
    FunnelsFilterType,
    | keyof FilterType
    | 'funnel_step_breakdown'
    | 'funnel_correlation_person_entity'
    | 'funnel_correlation_person_converted'
    | 'entrance_period_start'
    | 'drop_off'
    | 'funnel_step'
    | 'funnel_custom_steps'
>

export interface FunnelExclusionSteps {
    funnelFromStep: integer
    funnelToStep: integer
}
export interface FunnelExclusionEventsNode extends EventsNode, FunnelExclusionSteps {}
export interface FunnelExclusionActionsNode extends ActionsNode, FunnelExclusionSteps {}
export type FunnelExclusion = FunnelExclusionEventsNode | FunnelExclusionActionsNode

export type FunnelsFilter = {
    /** @default [] */
    exclusions?: FunnelExclusion[]
    /** @default vertical */
    layout?: FunnelsFilterLegacy['layout']
    /** @asType integer */
    binCount?: FunnelsFilterLegacy['bin_count']
    /** @default first_touch */
    breakdownAttributionType?: FunnelsFilterLegacy['breakdown_attribution_type']
    breakdownAttributionValue?: integer
    funnelAggregateByHogQL?: FunnelsFilterLegacy['funnel_aggregate_by_hogql']
    funnelToStep?: integer
    funnelFromStep?: integer
    /** @default ordered */
    funnelOrderType?: FunnelsFilterLegacy['funnel_order_type']
    /** @default steps */
    funnelVizType?: FunnelsFilterLegacy['funnel_viz_type']
    /** @default 14 */
    funnelWindowInterval?: integer
    /** @default day */
    funnelWindowIntervalUnit?: FunnelsFilterLegacy['funnel_window_interval_unit']
    hiddenLegendBreakdowns?: string[]
    /** @default total */
    funnelStepReference?: FunnelsFilterLegacy['funnel_step_reference']
    useUdf?: boolean
}

export interface FunnelsQuery extends InsightsQueryBase<FunnelsQueryResponse> {
    kind: NodeKind.FunnelsQuery
    /** Granularity of the response. Can be one of `hour`, `day`, `week` or `month` */
    interval?: IntervalType
    /** Events and actions to include */
    series: AnyEntityNode[]
    /** Properties specific to the funnels insight */
    funnelsFilter?: FunnelsFilter
    /** Breakdown of the events and actions */
    breakdownFilter?: BreakdownFilter
}

/** @asType integer */
type BinNumber = number
export type FunnelStepsResults = Record<string, any>[]
export type FunnelStepsBreakdownResults = Record<string, any>[][]
export type FunnelTimeToConvertResults = {
    average_conversion_time: number | null
    bins: [BinNumber, BinNumber][]
}
export type FunnelTrendsResults = Record<string, any>[]
export interface FunnelsQueryResponse
    extends AnalyticsQueryResponseBase<
        FunnelStepsResults | FunnelStepsBreakdownResults | FunnelTimeToConvertResults | FunnelTrendsResults
    > {
    isUdf?: boolean
}

export type CachedFunnelsQueryResponse = CachedQueryResponse<FunnelsQueryResponse>

/** `RetentionFilterType` minus everything inherited from `FilterType` */
export type RetentionFilterLegacy = Omit<RetentionFilterType, keyof FilterType>

export type RetentionFilter = {
    retentionType?: RetentionFilterLegacy['retention_type']
    retentionReference?: RetentionFilterLegacy['retention_reference']
    /** @default 11 */
    totalIntervals?: integer
    returningEntity?: RetentionFilterLegacy['returning_entity']
    targetEntity?: RetentionFilterLegacy['target_entity']
    /** @default Day */
    period?: RetentionFilterLegacy['period']
    showMean?: RetentionFilterLegacy['show_mean']
    cumulative?: RetentionFilterLegacy['cumulative']
}

export interface RetentionValue {
    count: integer
}

export interface RetentionResult {
    values: RetentionValue[]
    label: string
    /** @format date-time */
    date: string
}

export interface RetentionQueryResponse extends AnalyticsQueryResponseBase<RetentionResult[]> {}

export type CachedRetentionQueryResponse = CachedQueryResponse<RetentionQueryResponse>

export interface RetentionQuery extends InsightsQueryBase<RetentionQueryResponse> {
    kind: NodeKind.RetentionQuery
    /** Properties specific to the retention insight */
    retentionFilter: RetentionFilter
}

export interface PathsQueryResponse extends AnalyticsQueryResponseBase<Record<string, any>[]> {}

export type CachedPathsQueryResponse = CachedQueryResponse<PathsQueryResponse>

/** `PathsFilterType` minus everything inherited from `FilterType` and persons modal related params */
export type PathsFilterLegacy = Omit<
    PathsFilterType,
    keyof FilterType | 'path_start_key' | 'path_end_key' | 'path_dropoff_key'
>

export type PathsFilter = {
    /** @default 50 */
    edgeLimit?: integer
    pathsHogQLExpression?: PathsFilterLegacy['paths_hogql_expression']
    includeEventTypes?: PathsFilterLegacy['include_event_types']
    startPoint?: PathsFilterLegacy['start_point']
    endPoint?: PathsFilterLegacy['end_point']
    pathGroupings?: PathsFilterLegacy['path_groupings']
    excludeEvents?: PathsFilterLegacy['exclude_events']
    /** @default 5 */
    stepLimit?: integer
    pathReplacements?: PathsFilterLegacy['path_replacements']
    localPathCleaningFilters?: PathsFilterLegacy['local_path_cleaning_filters'] | null
    minEdgeWeight?: PathsFilterLegacy['min_edge_weight']
    maxEdgeWeight?: PathsFilterLegacy['max_edge_weight']

    /** Relevant only within actors query */
    pathStartKey?: string
    /** Relevant only within actors query */
    pathEndKey?: string
    /** Relevant only within actors query */
    pathDropoffKey?: string
}

export type FunnelPathsFilter = {
    funnelPathType: PathsFilterLegacy['funnel_paths']
    funnelSource: FunnelsQuery
    funnelStep?: integer
}

export interface PathsQuery extends InsightsQueryBase<PathsQueryResponse> {
    kind: NodeKind.PathsQuery
    /** Properties specific to the paths insight */
    pathsFilter: PathsFilter
    /** Used for displaying paths in relation to funnel steps. */
    funnelPathsFilter?: FunnelPathsFilter
}

/** `StickinessFilterType` minus everything inherited from `FilterType` and persons modal related params  */
export type StickinessFilterLegacy = Omit<StickinessFilterType, keyof FilterType | 'stickiness_days' | 'shown_as'>

export type StickinessOperator =
    | PropertyOperator.GreaterThanOrEqual
    | PropertyOperator.LessThanOrEqual
    | PropertyOperator.Exact

export type StickinessFilter = {
    display?: StickinessFilterLegacy['display']
    showLegend?: StickinessFilterLegacy['show_legend']
    showValuesOnSeries?: StickinessFilterLegacy['show_values_on_series']
    hiddenLegendIndexes?: integer[]
    stickinessCriteria?: {
        operator: StickinessOperator
        value: integer
    }
}

export const STICKINESS_FILTER_PROPERTIES = new Set<keyof StickinessFilter>([
    'display',
    'showLegend',
    'showValuesOnSeries',
    'hiddenLegendIndexes',
])

export interface StickinessQueryResponse extends AnalyticsQueryResponseBase<Record<string, any>[]> {}

export type CachedStickinessQueryResponse = CachedQueryResponse<StickinessQueryResponse>

export interface StickinessQuery
    extends Omit<InsightsQueryBase<StickinessQueryResponse>, 'aggregation_group_type_index'> {
    kind: NodeKind.StickinessQuery
    /**
     * Granularity of the response. Can be one of `hour`, `day`, `week` or `month`
     * @default day
     */
    interval?: IntervalType
    /** Events and actions to include */
    series: AnyEntityNode[]
    /** Properties specific to the stickiness insight */
    stickinessFilter?: StickinessFilter
    /** Compare to date range */
    compareFilter?: CompareFilter
}

/** `LifecycleFilterType` minus everything inherited from `FilterType` */
export type LifecycleFilterLegacy = Omit<LifecycleFilterType, keyof FilterType | 'shown_as'> & {
    /** Lifecycles that have been removed from display are not included in this array */
    toggledLifecycles?: LifecycleToggle[]
} // using everything except what it inherits from FilterType

export type LifecycleFilter = {
    showValuesOnSeries?: LifecycleFilterLegacy['show_values_on_series']
    toggledLifecycles?: LifecycleFilterLegacy['toggledLifecycles']
    /** @default false */
    showLegend?: LifecycleFilterLegacy['show_legend']
}

export type RefreshType =
    | boolean
    | 'async'
    | 'async_except_on_cache_miss'
    | 'blocking'
    | 'force_async'
    | 'force_blocking'
    | 'force_cache'
    | 'lazy_async'

export interface QueryRequest {
    /** Client provided query ID. Can be used to retrieve the status or cancel the query. */
    client_query_id?: string
    // Sync the `refresh` description here with the two instances in posthog/api/insight.py
    /**
     * Whether results should be calculated sync or async, and how much to rely on the cache:
     * - `'blocking'` - calculate synchronously (returning only when the query is done), UNLESS there are very fresh results in the cache
     * - `'async'` - kick off background calculation (returning immediately with a query status), UNLESS there are very fresh results in the cache
     * - `'lazy_async'` - kick off background calculation, UNLESS there are somewhat fresh results in the cache
     * - `'force_blocking'` - calculate synchronously, even if fresh results are already cached
     * - `'force_async'` - kick off background calculation, even if fresh results are already cached
     * - `'force_cache'` - return cached data or a cache miss; always completes immediately as it never calculates
     * Background calculation can be tracked using the `query_status` response field.
     * @default 'blocking'
     */
    refresh?: RefreshType
    /** @deprecated Use `refresh` instead. */
    async?: boolean
    /**
     * Submit a JSON string representing a query for PostHog data analysis,
     * for example a HogQL query.
     *
     * Example payload:
     *
     * ```
     *
     * {"query": {"kind": "HogQLQuery", "query": "select * from events limit 100"}}
     *
     * ```
     *
     * For more details on HogQL queries,
     * see the [PostHog HogQL documentation](/docs/hogql#api-access).
     */
    query: QuerySchema
    filters_override?: DashboardFilter
    variables_override?: Record<string, Record<string, any>>
}

/**
 * All analytics query responses must inherit from this.
 * @internal - no need to emit to schema.json.
 */
export interface AnalyticsQueryResponseBase<T> {
    results: T
    /** Measured timings for different parts of the query generation process */
    timings?: QueryTiming[]
    /** Generated HogQL query. */
    hogql?: string
    /** Query error. Returned only if 'explain' or `modifiers.debug` is true. Throws an error otherwise. */
    error?: string
    /** Modifiers used when performing the query */
    modifiers?: HogQLQueryModifiers
    /** Query status indicates whether next to the provided data, a query is still running. */
    query_status?: QueryStatus
}

interface CachedQueryResponseMixin {
    is_cached: boolean
    /**  @format date-time */
    last_refresh: string
    /**  @format date-time */
    next_allowed_client_refresh: string
    /**  @format date-time */
    cache_target_age?: string
    cache_key: string
    timezone: string
    /** Query status indicates whether next to the provided data, a query is still running. */
    query_status?: QueryStatus
    /** What triggered the calculation of the query, leave empty if user/immediate */
    calculation_trigger?: string
}

type CachedQueryResponse<T> = T & CachedQueryResponseMixin

export type GenericCachedQueryResponse = CachedQueryResponse<Record<string, any>>

export interface QueryStatusResponse {
    query_status: QueryStatus
}

/** @deprecated Only exported for use in test_query_runner.py! Don't use anywhere else. */
export interface TestBasicQueryResponse extends AnalyticsQueryResponseBase<any[]> {}
/** @deprecated Only exported for use in test_query_runner.py! Don't use anywhere else. */
export type TestCachedBasicQueryResponse = CachedQueryResponse<TestBasicQueryResponse>

export interface CacheMissResponse {
    cache_key: string | null
    query_status?: QueryStatus
}

export type ClickhouseQueryProgress = {
    bytes_read: integer
    rows_read: integer
    estimated_rows_total: integer
    time_elapsed: integer
    active_cpu_time: integer
}

export type QueryStatus = {
    id: string
    /**
     * ONLY async queries use QueryStatus.
     * @default true
     */
    query_async: true
    team_id: integer
    insight_id?: integer
    dashboard_id?: integer
    /**
     * If the query failed, this will be set to true.
     * More information can be found in the error_message field.
     * @default false
     */
    error: boolean
    /**
     * Whether the query is still running. Will be true if the query is complete, even if it errored.
     * Either result or error will be set.
     * @default false
     */
    complete: boolean
    /**  @default null */
    error_message: string | null
    results?: any
    /** When was the query execution task picked up by a worker. @format date-time */
    pickup_time?: string
    /** When was query execution task enqueued. @format date-time */
    start_time?: string
    /** When did the query execution task finish (whether successfully or not). @format date-time */
    end_time?: string
    /**  @format date-time */
    expiration_time?: string
    task_id?: string
    query_progress?: ClickhouseQueryProgress
    labels?: string[]
}

export interface LifecycleQueryResponse extends AnalyticsQueryResponseBase<Record<string, any>[]> {}

export type CachedLifecycleQueryResponse = CachedQueryResponse<LifecycleQueryResponse>

export interface LifecycleQuery extends InsightsQueryBase<LifecycleQueryResponse> {
    kind: NodeKind.LifecycleQuery
    /**
     * Granularity of the response. Can be one of `hour`, `day`, `week` or `month`
     * @default day
     */
    interval?: IntervalType
    /** Events and actions to include */
    series: AnyEntityNode[]
    /** Properties specific to the lifecycle insight */
    lifecycleFilter?: LifecycleFilter
}

export interface ActorsQueryResponse extends AnalyticsQueryResponseBase<any[][]> {
    columns: any[]
    types: string[]
    hogql: string
    hasMore?: boolean
    limit: integer
    offset: integer
    missing_actors_count?: integer
}

export type CachedActorsQueryResponse = CachedQueryResponse<ActorsQueryResponse>

export interface ActorsQuery extends DataNode<ActorsQueryResponse> {
    kind: NodeKind.ActorsQuery
    source?: InsightActorsQuery | FunnelsActorsQuery | FunnelCorrelationActorsQuery | HogQLQuery
    select?: HogQLExpression[]
    search?: string
    /** Currently only person filters supported. No filters for querying groups. See `filter_conditions()` in actor_strategies.py. */
    properties?: AnyPersonScopeFilter[]
    /** Currently only person filters supported. No filters for querying groups. See `filter_conditions()` in actor_strategies.py. */
    fixedProperties?: AnyPersonScopeFilter[]
    orderBy?: string[]
    limit?: integer
    offset?: integer
}

export interface TimelineEntry {
    /** Session ID. None means out-of-session events */
    sessionId?: string
    events: EventType[]
    /** Duration of the recording in seconds. */
    recording_duration_s?: number
}

export interface SessionsTimelineQueryResponse extends AnalyticsQueryResponseBase<TimelineEntry[]> {
    hasMore?: boolean
}

export type CachedSessionsTimelineQueryResponse = CachedQueryResponse<SessionsTimelineQueryResponse>

export interface SessionsTimelineQuery extends DataNode<SessionsTimelineQueryResponse> {
    kind: NodeKind.SessionsTimelineQuery
    /** Fetch sessions only for a given person */
    personId?: string
    /** Only fetch sessions that started after this timestamp (default: '-24h') */
    after?: string
    /** Only fetch sessions that started before this timestamp (default: '+5s') */
    before?: string
}
export type WebAnalyticsPropertyFilter = EventPropertyFilter | PersonPropertyFilter | SessionPropertyFilter
export type WebAnalyticsPropertyFilters = WebAnalyticsPropertyFilter[]
export type ActionConversionGoal = {
    actionId: integer
}
export type CustomEventConversionGoal = {
    customEventName: string
}
export type WebAnalyticsConversionGoal = ActionConversionGoal | CustomEventConversionGoal
interface WebAnalyticsQueryBase<R extends Record<string, any>> extends DataNode<R> {
    dateRange?: DateRange
    properties: WebAnalyticsPropertyFilters
    conversionGoal?: WebAnalyticsConversionGoal | null
    compareFilter?: CompareFilter
    sampling?: {
        enabled?: boolean
        forceSamplingRate?: SamplingRate
    }
    filterTestAccounts?: boolean
    /** @deprecated ignored, always treated as enabled **/
    useSessionsTable?: boolean
}

export interface WebOverviewQuery extends WebAnalyticsQueryBase<WebOverviewQueryResponse> {
    kind: NodeKind.WebOverviewQuery
    includeLCPScore?: boolean
}

export type WebOverviewItemKind = 'unit' | 'duration_s' | 'percentage'
export interface WebOverviewItem {
    key: string
    value?: number
    previous?: number
    kind: WebOverviewItemKind
    changeFromPreviousPct?: number
    isIncreaseBad?: boolean
}

export interface SamplingRate {
    numerator: number
    denominator?: number
}

export interface WebOverviewQueryResponse extends AnalyticsQueryResponseBase<WebOverviewItem[]> {
    samplingRate?: SamplingRate
    dateFrom?: string
    dateTo?: string
}

export type CachedWebOverviewQueryResponse = CachedQueryResponse<WebOverviewQueryResponse>

export enum WebStatsBreakdown {
    Page = 'Page',
    InitialPage = 'InitialPage',
    ExitPage = 'ExitPage', // not supported in the legacy version
    ExitClick = 'ExitClick',
    InitialChannelType = 'InitialChannelType',
    InitialReferringDomain = 'InitialReferringDomain',
    InitialUTMSource = 'InitialUTMSource',
    InitialUTMCampaign = 'InitialUTMCampaign',
    InitialUTMMedium = 'InitialUTMMedium',
    InitialUTMTerm = 'InitialUTMTerm',
    InitialUTMContent = 'InitialUTMContent',
    InitialUTMSourceMediumCampaign = 'InitialUTMSourceMediumCampaign',
    Browser = 'Browser',
    OS = 'OS',
    DeviceType = 'DeviceType',
    Country = 'Country',
    Region = 'Region',
    City = 'City',
    Timezone = 'Timezone',
    Language = 'Language',
}
export interface WebStatsTableQuery extends WebAnalyticsQueryBase<WebStatsTableQueryResponse> {
    kind: NodeKind.WebStatsTableQuery
    breakdownBy: WebStatsBreakdown
    includeScrollDepth?: boolean // automatically sets includeBounceRate to true
    includeBounceRate?: boolean
    doPathCleaning?: boolean
    limit?: integer
}
export interface WebStatsTableQueryResponse extends AnalyticsQueryResponseBase<unknown[]> {
    types?: unknown[]
    columns?: unknown[]
    hogql?: string
    samplingRate?: SamplingRate
    hasMore?: boolean
    limit?: integer
    offset?: integer
}
export type CachedWebStatsTableQueryResponse = CachedQueryResponse<WebStatsTableQueryResponse>

export interface WebExternalClicksTableQuery extends WebAnalyticsQueryBase<WebExternalClicksTableQueryResponse> {
    kind: NodeKind.WebExternalClicksTableQuery
    limit?: integer
    stripQueryParams?: boolean
}
export interface WebExternalClicksTableQueryResponse extends AnalyticsQueryResponseBase<unknown[]> {
    types?: unknown[]
    columns?: unknown[]
    hogql?: string
    samplingRate?: SamplingRate
    hasMore?: boolean
    limit?: integer
    offset?: integer
}
export type CachedWebExternalClicksTableQueryResponse = CachedQueryResponse<WebExternalClicksTableQueryResponse>

export interface WebGoalsQuery extends WebAnalyticsQueryBase<WebGoalsQueryResponse> {
    kind: NodeKind.WebGoalsQuery
    limit?: integer
}

export interface WebGoalsQueryResponse extends AnalyticsQueryResponseBase<unknown[]> {
    types?: unknown[]
    columns?: unknown[]
    hogql?: string
    samplingRate?: SamplingRate
    hasMore?: boolean
    limit?: integer
    offset?: integer
}
export type CachedWebGoalsQueryResponse = CachedQueryResponse<WebGoalsQueryResponse>

export enum SessionAttributionGroupBy {
    ChannelType = 'ChannelType',
    Medium = 'Medium',
    Source = 'Source',
    Campaign = 'Campaign',
    AdIds = 'AdIds',
    ReferringDomain = 'ReferringDomain',
    InitialURL = 'InitialURL',
}
export interface SessionAttributionExplorerQuery extends DataNode<SessionAttributionExplorerQueryResponse> {
    kind: NodeKind.SessionAttributionExplorerQuery
    groupBy: SessionAttributionGroupBy[]
    filters?: {
        properties?: SessionPropertyFilter[]
        dateRange?: DateRange
    }
    limit?: integer
    offset?: integer
}

export interface SessionAttributionExplorerQueryResponse extends AnalyticsQueryResponseBase<unknown> {
    hasMore?: boolean
    limit?: integer
    offset?: integer
    types?: unknown[]
    columns?: unknown[]
}
export type CachedSessionAttributionExplorerQueryResponse = CachedQueryResponse<SessionAttributionExplorerQueryResponse>

export interface ErrorTrackingQuery extends DataNode<ErrorTrackingQueryResponse> {
    kind: NodeKind.ErrorTrackingQuery
    issueId?: string
    select?: HogQLExpression[]
    orderBy?: 'last_seen' | 'first_seen' | 'occurrences' | 'users' | 'sessions'
    dateRange: DateRange
    assignee?: integer | null
    filterGroup?: PropertyGroupFilter
    filterTestAccounts?: boolean
    searchQuery?: string
    limit?: integer
    offset?: integer
}

export interface ErrorTrackingIssue {
    id: string
    name: string | null
    description: string | null
    occurrences: number
    sessions: number
    users: number
    /**  @format date-time */
    first_seen: string
    /**  @format date-time */
    last_seen: string
    // Sparkline data handled by the DataTable
    volume?: any
    assignee: number | null
    status: 'archived' | 'active' | 'resolved' | 'pending_release'
}

export interface ErrorTrackingQueryResponse extends AnalyticsQueryResponseBase<ErrorTrackingIssue[]> {
    hasMore?: boolean
    limit?: integer
    offset?: integer
    columns?: string[]
}
export type CachedErrorTrackingQueryResponse = CachedQueryResponse<ErrorTrackingQueryResponse>

export type InsightQueryNode =
    | TrendsQuery
    | FunnelsQuery
    | RetentionQuery
    | PathsQuery
    | StickinessQuery
    | LifecycleQuery

export interface ExperimentVariantTrendsBaseStats {
    key: string
    count: number
    exposure: number
    absolute_exposure: number
}

export interface ExperimentVariantFunnelsBaseStats {
    key: string
    success_count: number
    failure_count: number
}

export enum ExperimentSignificanceCode {
    Significant = 'significant',
    NotEnoughExposure = 'not_enough_exposure',
    LowWinProbability = 'low_win_probability',
    HighLoss = 'high_loss',
    HighPValue = 'high_p_value',
}

export interface ExperimentTrendsQueryResponse {
    kind: NodeKind.ExperimentTrendsQuery
    insight: Record<string, any>[]
    count_query?: TrendsQuery
    exposure_query?: TrendsQuery
    variants: ExperimentVariantTrendsBaseStats[]
    probability: Record<string, number>
    significant: boolean
    significance_code: ExperimentSignificanceCode
    stats_version?: integer
    p_value: number
    credible_intervals: Record<string, [number, number]>
}

export type CachedExperimentTrendsQueryResponse = CachedQueryResponse<ExperimentTrendsQueryResponse>

export interface ExperimentFunnelsQueryResponse {
    kind: NodeKind.ExperimentFunnelsQuery
    insight: Record<string, any>[][]
    funnels_query?: FunnelsQuery
    variants: ExperimentVariantFunnelsBaseStats[]
    probability: Record<string, number>
    significant: boolean
    significance_code: ExperimentSignificanceCode
    expected_loss: number
    credible_intervals: Record<string, [number, number]>
    stats_version?: integer
}

export type CachedExperimentFunnelsQueryResponse = CachedQueryResponse<ExperimentFunnelsQueryResponse>

export interface ExperimentFunnelsQuery extends DataNode<ExperimentFunnelsQueryResponse> {
    kind: NodeKind.ExperimentFunnelsQuery
    name?: string
    experiment_id?: integer
    funnels_query: FunnelsQuery
    stats_version?: integer
}

export interface ExperimentTrendsQuery extends DataNode<ExperimentTrendsQueryResponse> {
    kind: NodeKind.ExperimentTrendsQuery
    name?: string
    experiment_id?: integer
    count_query: TrendsQuery
    // Defaults to $feature_flag_called if not specified
    // https://github.com/PostHog/posthog/blob/master/posthog/hogql_queries/experiments/experiment_trends_query_runner.py
    exposure_query?: TrendsQuery
    stats_version?: integer
}

/**
 * @discriminator kind
 */
export type InsightQuerySource = InsightQueryNode
export type InsightNodeKind = InsightQueryNode['kind']
export type InsightFilterProperty =
    | 'trendsFilter'
    | 'funnelsFilter'
    | 'retentionFilter'
    | 'pathsFilter'
    | 'stickinessFilter'
    | 'lifecycleFilter'
export type InsightFilter =
    | TrendsFilter
    | FunnelsFilter
    | RetentionFilter
    | PathsFilter
    | StickinessFilter
    | LifecycleFilter

export type Day = integer

export interface InsightActorsQueryBase extends DataNode<ActorsQueryResponse> {
    includeRecordings?: boolean
    modifiers?: HogQLQueryModifiers
}

export interface InsightActorsQuery<S extends InsightsQueryBase<AnalyticsQueryResponseBase<any>> = InsightQuerySource>
    extends InsightActorsQueryBase {
    kind: NodeKind.InsightActorsQuery
    source: S
    day?: string | Day
    status?: string
    /** An interval selected out of available intervals in source query. */
    interval?: integer
    series?: integer
    breakdown?: string | BreakdownValueInt | string[]
    compare?: 'current' | 'previous'
}

export interface FunnelsActorsQuery extends InsightActorsQueryBase {
    kind: NodeKind.FunnelsActorsQuery
    source: FunnelsQuery
    /** Index of the step for which we want to get the timestamp for, per person.
     * Positive for converted persons, negative for dropped of persons. */
    funnelStep?: integer
    /** Custom step numbers to get persons for. This overrides `funnelStep`. Primarily for correlation use. */
    funnelCustomSteps?: integer[]
    /** The breakdown value for which to get persons for. This is an array for
     * person and event properties, a string for groups and an integer for cohorts. */
    funnelStepBreakdown?: BreakdownKeyType
    funnelTrendsDropOff?: boolean
    /** Used together with `funnelTrendsDropOff` for funnels time conversion date for the persons modal. */
    funnelTrendsEntrancePeriodStart?: string
}

export interface FunnelCorrelationActorsQuery extends InsightActorsQueryBase {
    kind: NodeKind.FunnelCorrelationActorsQuery
    source: FunnelCorrelationQuery
    funnelCorrelationPersonConverted?: boolean
    funnelCorrelationPersonEntity?: AnyEntityNode
    funnelCorrelationPropertyValues?: AnyPropertyFilter[]
}

export interface EventDefinition {
    event: string
    properties: Record<string, any>
    elements: any[]
}

export interface EventOddsRatioSerialized {
    event: EventDefinition
    success_count: integer
    failure_count: integer
    odds_ratio: number
    correlation_type: 'success' | 'failure'
}

export interface FunnelCorrelationResult {
    events: EventOddsRatioSerialized[]
    skewed: boolean
}

export interface FunnelCorrelationResponse extends AnalyticsQueryResponseBase<FunnelCorrelationResult> {
    columns?: any[]
    types?: any[]
    hasMore?: boolean
    limit?: integer
    offset?: integer
}
export type CachedFunnelCorrelationResponse = FunnelCorrelationResponse & CachedRetentionQueryResponse

export enum FunnelCorrelationResultsType {
    Events = 'events',
    Properties = 'properties',
    EventWithProperties = 'event_with_properties',
}

export interface FunnelCorrelationQuery extends Node<FunnelCorrelationResponse> {
    kind: NodeKind.FunnelCorrelationQuery
    source: FunnelsActorsQuery
    funnelCorrelationType: FunnelCorrelationResultsType

    /* Events */
    funnelCorrelationExcludeEventNames?: string[]

    /* Events with properties */
    funnelCorrelationEventNames?: string[]
    funnelCorrelationEventExcludePropertyNames?: string[]

    /* Properties */
    funnelCorrelationNames?: string[]
    funnelCorrelationExcludeNames?: string[]
}

/**  @format date-time */
export type DatetimeDay = string

export type BreakdownValueInt = integer
export interface BreakdownItem {
    label: string
    value: string | BreakdownValueInt
}
export interface MultipleBreakdownOptions {
    values: BreakdownItem[]
}

export interface InsightActorsQueryOptionsResponse {
    // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
    day?: { label: string; value: string | DatetimeDay | Day }[]
    status?: { label: string; value: string }[]
    interval?: {
        label: string
        /**
         * An interval selected out of available intervals in source query

         */
        value: integer
    }[]
    breakdown?: BreakdownItem[]
    breakdowns?: MultipleBreakdownOptions[]
    series?: {
        label: string
        value: integer
    }[]
    compare?: {
        label: string
        value: string
    }[]
}
export const insightActorsQueryOptionsResponseKeys: string[] = [
    'day',
    'status',
    'interval',
    'breakdown',
    'breakdowns',
    'series',
    'compare',
]

export type CachedInsightActorsQueryOptionsResponse = CachedQueryResponse<InsightActorsQueryOptionsResponse>

export interface InsightActorsQueryOptions extends Node<InsightActorsQueryOptionsResponse> {
    kind: NodeKind.InsightActorsQueryOptions
    source: InsightActorsQuery | FunnelsActorsQuery | FunnelCorrelationActorsQuery
}

export interface DatabaseSchemaSchema {
    id: string
    name: string
    should_sync: boolean
    incremental: boolean
    status?: string
    last_synced_at?: string
}

export interface DatabaseSchemaSource {
    id: string
    status: string
    source_type: string
    prefix: string
    last_synced_at?: string
}

export interface DatabaseSchemaField {
    name: string
    hogql_value: string
    type: DatabaseSerializedFieldType
    schema_valid: boolean
    table?: string
    fields?: string[]
    chain?: (string | integer)[]
    id?: string
}

export interface DatabaseSchemaTableCommon {
    type: 'posthog' | 'data_warehouse' | 'view' | 'batch_export' | 'materialized_view'
    id: string
    name: string
    fields: Record<string, DatabaseSchemaField>
}

export interface DatabaseSchemaViewTable extends DatabaseSchemaTableCommon {
    type: 'view'
    query: HogQLQuery
}

export interface DatabaseSchemaMaterializedViewTable extends DatabaseSchemaTableCommon {
    type: 'materialized_view'
    query: HogQLQuery
    last_run_at?: string
    status?: string
}

export interface DatabaseSchemaPostHogTable extends DatabaseSchemaTableCommon {
    type: 'posthog'
}

export interface DatabaseSchemaDataWarehouseTable extends DatabaseSchemaTableCommon {
    type: 'data_warehouse'
    format: string
    url_pattern: string
    schema?: DatabaseSchemaSchema
    source?: DatabaseSchemaSource
}

export interface DatabaseSchemaBatchExportTable extends DatabaseSchemaTableCommon {
    type: 'batch_export'
}

export type DatabaseSchemaTable =
    | DatabaseSchemaPostHogTable
    | DatabaseSchemaDataWarehouseTable
    | DatabaseSchemaViewTable
    | DatabaseSchemaBatchExportTable
    | DatabaseSchemaMaterializedViewTable

export interface DatabaseSchemaQueryResponse {
    tables: Record<string, DatabaseSchemaTable>
}

export interface DatabaseSchemaQuery extends DataNode<DatabaseSchemaQueryResponse> {
    kind: NodeKind.DatabaseSchemaQuery
}

export type DatabaseSerializedFieldType =
    | 'integer'
    | 'float'
    | 'string'
    | 'datetime'
    | 'date'
    | 'boolean'
    | 'array'
    | 'json'
    | 'lazy_table'
    | 'virtual_table'
    | 'field_traverser'
    | 'expression'
    | 'view'
    | 'materialized_view'

export type HogQLExpression = string

// Various utility types below

export interface DateRange {
    date_from?: string | null
    date_to?: string | null
    /** Whether the date_from and date_to should be used verbatim. Disables
     * rounding to the start and end of period.
     * @default false
     * */
    explicitDate?: boolean | null
}

export type MultipleBreakdownType = Extract<BreakdownType, 'person' | 'event' | 'group' | 'session' | 'hogql'>

export interface Breakdown {
    type?: MultipleBreakdownType | null
    property: string
    normalize_url?: boolean
    group_type_index?: integer | null
    histogram_bin_count?: integer // trends breakdown histogram bin
}

export interface BreakdownFilter {
    // TODO: unclutter
    /** @default event */
    breakdown_type?: BreakdownType | null
    breakdown_limit?: integer
    breakdown?: string | integer | (string | integer)[] | null
    breakdown_normalize_url?: boolean
    /**
     * @maxLength 3
     */
    breakdowns?: Breakdown[] // We want to limit maximum count of breakdowns avoiding overloading.
    breakdown_group_type_index?: integer | null
    breakdown_histogram_bin_count?: integer // trends breakdown histogram bin
    breakdown_hide_other_aggregation?: boolean | null // hides the "other" field for trends
}

// TODO: Rename to `DashboardFilters` for consistency with `HogQLFilters`
export interface DashboardFilter {
    date_from?: string | null
    date_to?: string | null
    properties?: AnyPropertyFilter[] | null
}

export interface InsightsThresholdBounds {
    lower?: number
    upper?: number
}

export enum InsightThresholdType {
    ABSOLUTE = 'absolute',
    PERCENTAGE = 'percentage',
}

export interface InsightThreshold {
    type: InsightThresholdType
    bounds?: InsightsThresholdBounds
}

export enum AlertConditionType {
    ABSOLUTE_VALUE = 'absolute_value', // default alert, checks absolute value of current interval
    RELATIVE_INCREASE = 'relative_increase', // checks increase in value during current interval compared to previous interval
    RELATIVE_DECREASE = 'relative_decrease', // checks decrease in value during current interval compared to previous interval
}

export interface AlertCondition {
    // Conditions in addition to the separate threshold
    // TODO: Think about things like relative thresholds, rate of change, etc.
    type: AlertConditionType
}

export enum AlertState {
    FIRING = 'Firing',
    NOT_FIRING = 'Not firing',
    ERRORED = 'Errored',
    SNOOZED = 'Snoozed',
}

export enum AlertCalculationInterval {
    HOURLY = 'hourly',
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export interface TrendsAlertConfig {
    type: 'TrendsAlertConfig'
    series_index: integer
    check_ongoing_interval?: boolean
}

export interface HogCompileResponse {
    bytecode: any[]
    locals: any[]
}

export interface SuggestedQuestionsQuery extends DataNode<SuggestedQuestionsQueryResponse> {
    kind: NodeKind.SuggestedQuestionsQuery
}

export interface SuggestedQuestionsQueryResponse {
    questions: string[]
}

export type CachedSuggestedQuestionsQueryResponse = CachedQueryResponse<SuggestedQuestionsQueryResponse>

export interface TeamTaxonomyItem {
    event: string
    count: integer
}

export type TeamTaxonomyResponse = TeamTaxonomyItem[]

export interface TeamTaxonomyQuery extends DataNode<TeamTaxonomyQueryResponse> {
    kind: NodeKind.TeamTaxonomyQuery
}

export type TeamTaxonomyQueryResponse = AnalyticsQueryResponseBase<TeamTaxonomyResponse>

export type CachedTeamTaxonomyQueryResponse = CachedQueryResponse<TeamTaxonomyQueryResponse>

export interface EventTaxonomyItem {
    property: string
    sample_values: string[]
    sample_count: integer
}

export type EventTaxonomyResponse = EventTaxonomyItem[]

export interface EventTaxonomyQuery extends DataNode<EventTaxonomyQueryResponse> {
    kind: NodeKind.EventTaxonomyQuery
    event: string
    properties?: string[]
}

export type EventTaxonomyQueryResponse = AnalyticsQueryResponseBase<EventTaxonomyResponse>

export type CachedEventTaxonomyQueryResponse = CachedQueryResponse<EventTaxonomyQueryResponse>

export interface ActorsPropertyTaxonomyResponse {
    // Values can be floats and integers. The comment below is to preserve the `integer` type.
    // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
    sample_values: (string | number | boolean | integer)[]
    sample_count: integer
}

export interface ActorsPropertyTaxonomyQuery extends DataNode<ActorsPropertyTaxonomyQueryResponse> {
    kind: NodeKind.ActorsPropertyTaxonomyQuery
    property: string
    group_type_index?: integer
}

export type ActorsPropertyTaxonomyQueryResponse = AnalyticsQueryResponseBase<ActorsPropertyTaxonomyResponse>

export type CachedActorsPropertyTaxonomyQueryResponse = CachedQueryResponse<ActorsPropertyTaxonomyQueryResponse>

export enum AssistantMessageType {
    Human = 'human',
    Assistant = 'ai',
    Reasoning = 'ai/reasoning',
    Visualization = 'ai/viz',
    Failure = 'ai/failure',
    Router = 'ai/router',
}

export interface BaseAssistantMessage {
    id?: string
}

export interface HumanMessage extends BaseAssistantMessage {
    type: AssistantMessageType.Human
    content: string
}

export interface AssistantMessage extends BaseAssistantMessage {
    type: AssistantMessageType.Assistant
    content: string
}

export interface ReasoningMessage extends BaseAssistantMessage {
    type: AssistantMessageType.Reasoning
    content: string
    substeps?: string[]
}

export interface VisualizationMessage extends BaseAssistantMessage {
    type: AssistantMessageType.Visualization
    plan?: string
    answer?: AssistantTrendsQuery | AssistantFunnelsQuery
    initiator?: string
}

export interface FailureMessage extends BaseAssistantMessage {
    type: AssistantMessageType.Failure
    content?: string
}

export interface RouterMessage extends BaseAssistantMessage {
    type: AssistantMessageType.Router
    content: string
}

export type RootAssistantMessage =
    | VisualizationMessage
    | ReasoningMessage
    | AssistantMessage
    | HumanMessage
    | FailureMessage
    | RouterMessage

export enum AssistantEventType {
    Status = 'status',
    Message = 'message',
    Conversation = 'conversation',
}

export enum AssistantGenerationStatusType {
    Acknowledged = 'ack',
    GenerationError = 'generation_error',
}

export interface AssistantGenerationStatusEvent {
    type: AssistantGenerationStatusType
}

export enum CustomChannelField {
    UTMSource = 'utm_source',
    UTMMedium = 'utm_medium',
    UTMCampaign = 'utm_campaign',
    ReferringDomain = 'referring_domain',
}

export enum CustomChannelOperator {
    Exact = 'exact',
    IsNot = 'is_not',
    IsSet = 'is_set',
    IsNotSet = 'is_not_set',
    IContains = 'icontains',
    NotIContains = 'not_icontains',
    Regex = 'regex',
    NotRegex = 'not_regex',
}

export interface CustomChannelCondition {
    key: CustomChannelField
    value?: string | string[]
    op: CustomChannelOperator
    id: string // the ID is only needed for the drag and drop, so only needs to be unique with one set of rules
}

export interface CustomChannelRule {
    items: CustomChannelCondition[]
    combiner: FilterLogicalOperator
    channel_type: string
    id: string // the ID is only needed for the drag and drop, so only needs to be unique with one set of rules
}

export enum DefaultChannelTypes {
    CrossNetwork = 'Cross Network',
    PaidSearch = 'Paid Search',
    PaidSocial = 'Paid Social',
    PaidVideo = 'Paid Video',
    PaidShopping = 'Paid Shopping',
    PaidUnknown = 'Paid Unknown',
    Direct = 'Direct',
    OrganicSearch = 'Organic Search',
    OrganicSocial = 'Organic Social',
    OrganicVideo = 'Organic Video',
    OrganicShopping = 'Organic Shopping',
    Push = 'Push',
    SMS = 'SMS',
    Audio = 'Audio',
    Email = 'Email',
    Referral = 'Referral',
    Affiliate = 'Affiliate',
    Unknown = 'Unknown',
}
