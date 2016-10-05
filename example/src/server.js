import React from 'react';
import App from './app';
import { renderToString } from 'react-router-server';
import { ServerRouter, createServerRenderContext } from 'react-router'
import express from 'express';
import path from 'path';
import stats from '../build/stats.json';

const app = express();
const context = createServerRenderContext();

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('*', function (req, res) {
  const server = (
    <ServerRouter
      location={req.url}
      context={context}
    >
      <App/>
    </ServerRouter>
  );

  renderToString(server, context)
    .then(markup => {
      const result = context.getResult();
      if (result.redirect) {
        // redirect
      } else if (result.missed) {
        // 404
      } else {
        res.render(
          path.join(__dirname, '..', 'index.ejs'),
          {
            markup,
            initialState: context.getInitialState(),
            ...context.getModules(stats)
          }
        );
      }
    })
    .catch(err => console.error(err));
});

app.listen(3000, function () {
  console.log('Example site listening on 3000!');
});
