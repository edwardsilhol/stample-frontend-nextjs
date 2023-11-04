export type RouteParams = {
  teamId: string;
  tagId?: string;
  documentId?: string;
};

export type AddRemoveDto<TFields> = {
  add?: TFields;
  remove?: TFields;
};
