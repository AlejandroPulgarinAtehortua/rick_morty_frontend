import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ApolloProvider } from '@apollo/client/react'
import client from './apolloClient.ts'
import { FavoritesProvider } from './context/FavoritesContext';
import { CommentsProvider } from './context/CommentsContext';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <FavoritesProvider>
        <CommentsProvider>
          <App />
        </CommentsProvider>
      </FavoritesProvider>
    </ApolloProvider>
  </StrictMode>,
)

