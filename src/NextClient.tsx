import { useFetchValue, useStoreValue } from '@nillion/client-react-hooks';
import * as React from 'react';
import { useState } from 'react';
import { Button, Box, Typography, List, ListItem, Stack } from '@mui/material';

export const NextClient = () => {
  const [id, setId] = useState('');
  const storeValue = useStoreValue();
  const fetchValue = useFetchValue(
    {
      id,
      name: 'foo',
      type: 'IntegerSecret',
    },
    {
      staleTime: 1000 * 30, // data stale after 30 seconds
    },
  );

  const data = {
    foo: 42,
  };

  if (storeValue.data && !id) {
    setId(storeValue.data);
  }

  const handleStoreClick = () => {
    storeValue.mutate({
      values: data,
      ttl: 1,
    });
  };

  const handleFetchClick = async () => {
    await fetchValue.refetch();
  };

  return (
    <Stack spacing={2} maxWidth={400} sx={{ mt: 4 }}>
      <Typography variant="h5">Hello from @nillion/client-* 👋</Typography>
      <Typography>Original data: {JSON.stringify(data)}</Typography>
      <Typography variant="h6">1. Store data</Typography>
      <Button onClick={handleStoreClick} variant="contained">
        Store
      </Button>
      <List>
        <ListItem>Status: {storeValue.status}</ListItem>
        {id && <ListItem>Id: {id}</ListItem>}
      </List>
      <Typography variant="h6">2. Read data</Typography>
      <Button
        onClick={handleFetchClick}
        variant="contained"
        disabled={!Boolean(id)}
      >
        Force refresh
      </Button>
      <List>
        <ListItem>Status: {fetchValue.status}</ListItem>
        <ListItem>
          Updated at: {new Date(fetchValue.dataUpdatedAt).toLocaleString()}
        </ListItem>
        <ListItem>
          From cache:{' '}
          {Boolean(
            fetchValue.isFetched && !fetchValue.isFetchedAfterMount,
          ).toString()}
        </ListItem>
        {fetchValue.data && (
          <ListItem>Data: {JSON.stringify(fetchValue.data)}</ListItem>
        )}
      </List>
    </Stack>
  );
};
