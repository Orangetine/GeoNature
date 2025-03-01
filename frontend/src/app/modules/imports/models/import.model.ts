import { Step } from './enums.model';
import { FieldMappingValues, ContentMappingValues } from './mapping.model';

export interface ImportErrorType {
  pk: number;
  category: string;
  name: string;
  description: string;
  level: string;
}

export interface ImportError {
  pk: number;
  id_import: number;
  id_type: number;
  type: ImportErrorType;
  column: string;
  rows: Array<number>;
  step: number;
  comment: string;
  show?: boolean;
}

export interface Dataset {
  dataset_name: string;
  active: boolean;
}
export interface ImportStatistics {
  import_count: number;
  [propName: string]: any;
}

export interface Import {
  id_import: number;
  format_source_file: string;
  srid: number;
  separator: string;
  detected_separator: null | string;
  encoding: string;
  detected_encoding: string;
  import_table: string;
  full_file_name: string;
  id_dataset: number;
  date_create_import: string;
  date_update_import: string;
  date_end_import: null | string;
  source_count: number;
  statistics: ImportStatistics;
  date_min_data: string;
  date_max_data: string;
  step: Step;
  uuid_autogenerated: boolean;
  loaded: boolean;
  processed: boolean;
  errors_count: null | number;
  fieldmapping: FieldMappingValues;
  contentmapping: ContentMappingValues;
  columns: null | [string];

  authors_name: string;
  available_encodings?: [string];
  available_formats?: [string];
  available_separators?: [string];
  detected_format?: string;
  task_progress?: number;
  task_id?: string;
  errors?: [ImportError];
  dataset?: Dataset;
  id_source?: number;
  id_destination: number;
  destination?: Destination;
}

export interface NomenclatureType {
  id_type: number;
  mnemonique: string;
  label_default: string;
  definition_default: string;

  isCollapsed?: boolean;
}

export interface Nomenclature {
  id_nomenclature: number;
  cd_nomenclature: string;
  mnemonique: string;
  label_default: string;
  definition_default: string;
  source: string;
  statut: string;
  id_broader: number;
  hierarchy: string;
  active: boolean;
  meta_create_date: string;
  meta_update_date: string;
}

export interface ImportValues {
  [target_field: string]: {
    nomenclature_type: NomenclatureType;
    nomenclatures: [Nomenclature];
    values?: [string];
  };
}

interface Entity {
  label: string;
}

interface Theme {
  id_theme: number;
  name_theme: string;
  fr_label_theme: string;
  eng_label_theme: string;
  desc_theme: string;
}

export interface Field {
  id_field: number;
  name_field: string;
  fr_label: string;
  eng_label: string;
  desc_field: string;
  mandatory: boolean;
  autogenerated: boolean;
  comment: string;
}

export interface ThemesFields {
  theme: Theme;
  fields: [Field];
}

export interface EntitiesThemesFields {
  entity: Entity;
  themes: [ThemesFields];
}

export interface TaxaDistribution {
  count: number;
  group: string;
}

// minimal dataset model
export interface Dataset {
  dataset_name: string;
}

export interface ImportPreview {
  valid_bbox: any;
  entities: [
    {
      entity: Entity;
      columns: [string];
      valid_data: [object];
      n_valid_data: number;
      n_invalid_data: number;
    },
  ];
}

export interface Destination {
  id_destination?: number;
  id_module?: number;
  code: string;
  label?: string;
  module: {
    id_module: number;
    module_code: string;
    module_label: string;
  };
}
