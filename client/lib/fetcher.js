import { useState, useEffect } from 'react';

export default async function fetcher(url, data) {
  return await fetch(`${url}`, {
    method: data ? 'POST' : 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.status > 399 && res.status < 200) {
        throw new Error();
      }
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
}
