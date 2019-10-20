/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllUsers
// ====================================================

export interface AllUsers_allUsers_users {
  __typename: "User";
  email: string | null;
  displayName: string | null;
  uid: string;
}

export interface AllUsers_allUsers {
  __typename: "UserConnection";
  cursor: string | null;
  hasMore: boolean;
  users: (AllUsers_allUsers_users | null)[] | null;
}

export interface AllUsers {
  allUsers: AllUsers_allUsers | null;
}

export interface AllUsersVariables {
  after?: string | null;
  pageSize?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================
