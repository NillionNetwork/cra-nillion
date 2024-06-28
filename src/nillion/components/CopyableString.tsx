import React, { useState } from 'react';
import { Box, Button, Snackbar } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { truncateString } from '../helpers/truncateString';

interface CopyableStringProps {
  text: string;
  copyText: string;
  shouldTruncate?: boolean;
  truncateLength?: number; // Optional prop to determine length of visible text
  splitter?: string; // Optional prop for splitting text
  descriptor?: string;
}

const CopyableString: React.FC<CopyableStringProps> = ({
  text,
  copyText,
  shouldTruncate = false,
  truncateLength = 10, // Default truncate length if not provided
  splitter = null, // Default to null if no splitter is provided
  descriptor = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

  return (
    <span>
      <span>
        {shouldTruncate
          ? truncateString(text, truncateLength, truncateLength, splitter)
          : text}
      </span>
      <CopyToClipboard text={copyText} onCopy={handleCopy}>
        <span style={{ paddingLeft: '8px', cursor: 'pointer' }}>
          {copied ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
        </span>
      </CopyToClipboard>
      <Snackbar
        open={copied}
        message={`Copied ${descriptor} to clipboard`}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
      />
    </span>
  );
};

export default CopyableString;
