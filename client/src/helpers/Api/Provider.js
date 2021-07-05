import React from 'react';
import {ApolloClient} from "apollo-client";
import {setContext} from "apollo-link-context";
import {authDataGet} from "../AuthUtils";
import {ApolloLink} from "apollo-link";
import {onError} from "apollo-link-error";
import {createUploadLink} from "apollo-upload-client/lib";
import {InMemoryCache} from "apollo-cache-inmemory";
import {ApolloProvider} from "react-apollo";

import {GRAPHQL_ENDPOINT} from '../../Config';

export const client = new ApolloClient({
    link: setContext((_, { headers }) => {
        let authData = authDataGet();
        return {
            headers: {
                ...headers,
                "Access-Token": authData.accessToken ||  '',
            }
        }
    }).concat(ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.slice().map(({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    ),
                );
            if (networkError)  {
                console.log(`[Network error]: ${networkError}`);
            }
        }),
        createUploadLink({
            uri: GRAPHQL_ENDPOINT,
        }),
    ])),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
    }
});

export default class extends React.Component {
    render() {
        return (
			<ApolloProvider client={client}>
				{this.props.children}
			</ApolloProvider>
		);
    }
}
