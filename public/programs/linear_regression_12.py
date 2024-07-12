# Logic from nada-ai linear_regression examples
# https://github.com/NillionNetwork/nada-ai/blob/main/examples/linear_regression/src/linear_regression.py

import nada_numpy as na

from nada_ai.linear_model import LinearRegression

def nada_main():
    # Set precision
    na.set_log_scale(32)
    # Step 1: We use Nada NumPy wrapper to create "Party0" and "Party1"
    parties = na.parties(2)

    # Step 2: Instantiate linear regression object
    # Using a Housing dataset with 12 features
    # https://www.kaggle.com/datasets/yasserh/housing-prices-dataset
    feature_count = 12
    my_model = LinearRegression(in_features=feature_count)

    # Step 3: Load model weights from Nillion network by passing model name (acts as ID)
    # In this examples Party0 provides the model and Party1 runs inference
    my_model.load_state_from_network("my_model", parties[0], na.SecretRational)

    # Step 4: Load input data to be used for inference (provided by Party1)
    my_input = na.array((feature_count,), parties[1], "my_input", na.SecretRational)

    # Step 5: Compute inference
    # Note: completely equivalent to `my_model(...)`
    result = my_model.forward(my_input)

    # Step 6: We can use result.output() to produce the output for Party1 and variable name "my_output"
    return na.output(result, parties[1], "my_output")