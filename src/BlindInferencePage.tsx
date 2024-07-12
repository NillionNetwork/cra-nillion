import React, { useEffect, useState } from 'react';
import GenerateUserKey from './nillion/components/GenerateUserKey';
import CreateClient from './nillion/components/CreateClient';
import * as nillion from '@nillion/client-web';
import { NillionClient, NadaValues } from '@nillion/client-web';
import ComputeForm from './nillion/components/ComputeForm';
import ConnectionInfo from './nillion/components/ConnectionInfo';
import LRHousingFormComponent from './nillion/components/LinearRegressionForm';

export default function BlindInferencePage() {
  // Party0 previously stored this program in the Nillion Testnet
  // so we can hard code the program name and id
  const programName = 'linear_regression_12';
  const programId =
    'NXxpgUdTRqCJAfC46rfoVvszvKkq9FkpYqHYrV81X66QimjbzdV9KWWCzQitYae4GHGKfqSMdrTuivgX7rKjHD5/linear_regression_12';

  // Party0 previously created the program and stored the model state
  // in the Nillion Testnet, so we can hard code those values
  const partyName_model_state = 'Party0';
  const partyId_model_state =
    '12D3KooWGXaSfWKAMtT1gYNMtdTurvMR4rqKaS5HNFU3Mubq9nRJ';
  const storeId_model_state = '9ebfc88f-9dfe-4ccd-a804-9ab15d13c486';

  const partyName = 'Party1'; // inference party
  const defaultUserKeySeed = 'inference_1'; // Party0 gave this user compute permissions
  const outputName = 'my_output';

  const [userkey, setUserKey] = useState<string | null>(null);
  const [client, setClient] = useState<NillionClient | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [additionalComputeValues, setAdditionalComputeValues] =
    useState<NadaValues | null>(null);
  const [computeResult, setComputeResult] = useState<string | null>(null);

  useEffect(() => {
    if (userkey && client) {
      setUserId(client.user_id);
      setPartyId(client.party_id);
    }
  }, [userkey, client]);

  const handleInputFeatureDataSet = (inputFeatureDataSet: any) => {
    const additionalComputeValues = new nillion.NadaValues();

    Object.keys(inputFeatureDataSet).forEach((key) => {
      const value = inputFeatureDataSet[key];
      console.log(key, value === 0 ? 1 : value * Math.pow(2, 32));
      additionalComputeValues.insert(
        key,
        nillion.NadaValue.new_secret_integer(
          (value === 0 ? 1 : value * Math.pow(2, 32)).toString()
        )
      );
    });

    setAdditionalComputeValues(additionalComputeValues);
  };

  const handleComputeResult = (result: any) => {
    console.log(result);
    // Rescale the obtained result by the quantization scale
    const rescaledResult = parseFloat(result.value) / Math.pow(2, 32);
    console.log(rescaledResult);
    setComputeResult(rescaledResult.toString());
  };

  return (
    <div>
      <h1>Blind Inference Demo with Housing Data</h1>
      <p>
        Inference is the process of using a trained model to make predictions or
        decisions based on new, unseen data. It is the phase where the model is
        applied to input data to generate an output, such as a prediction or
        classification.
        <br />
        <br />
        Connect to Nillion with a user key, then create a set of input features
        to run blind inference on Nillion to predict the house price of your new
        input home with 12 features: area, bedrooms, bathrooms, stories,
        mainroad, guestroom, basement, hotwaterheating, airconditioning,
        parking, prefarea, furnishingstatus. The inference is "blind" because
        the party running the price prediction with the new input never sees the
        trained model state, which is provided to the Nada program as a secret.
      </p>
      <br />
      <ConnectionInfo client={client} userkey={userkey} />

      <h1>1. Connect to Nillion Client {client && ' ✅'}</h1>
      <GenerateUserKey
        setUserKey={setUserKey}
        defaultUserKeySeed={defaultUserKeySeed}
      />

      {userkey && <CreateClient userKey={userkey} setClient={setClient} />}

      <br />
      <h1>2. Set input features</h1>
      {client && <LRHousingFormComponent setData={handleInputFeatureDataSet} />}
      <br />
      <h1>
        3. Compute on {programName} program to run blind inference{' '}
        {computeResult && ' ✅'}
      </h1>
      {client &&
        programId &&
        storeId_model_state &&
        partyId &&
        additionalComputeValues && (
          <ComputeForm
            shouldRescale
            nillionClient={client}
            programId={programId}
            additionalComputeValues={additionalComputeValues}
            storeIds={[storeId_model_state]}
            inputParties={[
              // Party0
              {
                partyName: partyName_model_state,
                partyId: partyId_model_state,
              },
              // Party1
              {
                partyName,
                partyId,
              },
            ]}
            outputParties={[{ partyName, partyId }]}
            outputName={outputName}
            onComputeProgram={handleComputeResult}
          />
        )}
      <br />
    </div>
  );
}
