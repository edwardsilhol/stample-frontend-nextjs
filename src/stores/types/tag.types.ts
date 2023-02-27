export type CreateTagDTO = {
  name: string;
  children?: string[];
};

type AddRemoveTagDTO = {
  children: string[];
};
export type UpdateTagDTO = {
  name?: string;
  add?: AddRemoveTagDTO;
  remove?: AddRemoveTagDTO;
};

export type HooksUpdateTagDTO = {
  tagId: string;
  payload: UpdateTagDTO;
};

export interface Tag {
  _id: string;
  name: string;
  children?: string[];
}

export interface TagRich {
  _id: string;
  name: string;
  children: TagRich[];
}
