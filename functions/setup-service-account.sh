#!/bin/bash

# This script sets up the Firebase Functions configuration for the service account

# Set Google Cloud project ID
firebase functions:config:set google.project_id="ftfc-451421"

# Set Google Cloud client email
firebase functions:config:set google.client_email="ftfc-website-service@ftfc-451421.iam.gserviceaccount.com"

# Set Google Cloud private key (replace newlines with \n)
# Note: The private key in your .env file already has \n characters, so we're using it as is
firebase functions:config:set google.private_key="nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCFalPw9d/hPtHB\nE2VBdbXanmd6E3QUl2esEtSOimyquj3tdpiQwbsv9sZAGycLMR/lRamYYTueOBsx\n0ZT00bw64bD1DarVujm/qHSwq85ALtECWVUmDoiwzyYQZnPTDzsXLEGSZ02BIvQL\nEGvSAIVxELYdY1/sqeFF6NulQEoAn6opaGCHcqo/wf1KfR7kZi9ug6IqSpu0n4fa\n27pftjHTW9bcN478+5192No3LNDhcmFfFvdbiIhVrY7XUXa+8O2vq6FeNSYV6zKp\n1rveWR+twvyH4qNq5P9oJE6R4VHSgVC+k0tp1AtZFHwenHcYJIiFpciOCeCJzvrT\nVBrnjiL1AgMBAAECggEAFNbWrT7unSuXjmnF6WtmQDN5dMlImrXKkQdw8aHgFuvX\n4/lgG85S+4s3jMhg+R/PfFu9AasAabaYUtgKhRIkrWrW3fQoUNGRlyUMMxNm+EIH\nzi7ffL4M7lcw+iNSqK9KmtREGsbthYQM7BSAzvDbZx2F4MHGuDwRzr5wXpfT51RP\nfINWNZioWuPfWGi8R18aXWI7vRUkfrepQX2nDLWsTVp32RQwy9DStgioLabAGr+t\nwZE/o9Tg1/f3MIMpzs0CT+lRaJUqvVwmEuFGwSDiSWkjXAEIa2k5KF1mL2v89woF\nUqjVx6tRdEhwrw/eM/bsOfMoNSM7xRCE+WxnHmY3oQKBgQC8YvfSMNvKCmhZyh8T\nhwYeUIOi02JCcVEk61V1tvZ4U7o36rFK42ts5kpJi/QLQJEjuiHjCGqAHWc/b/CW\nvfHobYEHeDFqW6Kdfi1ecq1dQCVV3QFgr3F3GgLJuBWgFlRJP5FTKuZFXB1nDf2r\nCDmSHQ4TEW2ZeNrrhnS3+xOIYQKBgQC1TJSWPg9VgcZkbj2nh8d4AaUQxLOhSHQ0\nlGKmTl1bB8lae6k+JD0YEa4h4D8i6HbYKyMmvbNgCGOj+ZdL+f+fyNS1rBtYYgog\nhTMy9aFIhQZvDXOPG52hr6ETsb9Up6NzmdZWsCy/HVv9eePRkwmcehngp9T3dvp/\nkykVcQzTFQKBgD9/dFzKzyqYu3eYY0Unu+434UbezT3sCBfTouiclRMV1azHVJ8T\nbMA2F1AW9llcmA9cy9NEoPEx9/0v8/47Y/CeCGHGJ5Hb9UH0p8IwETNfTbZVWgOG\n303v3IS1ocRmAl72KDvKN/elBtwXoSsnCJCxbm8K7tBOJixBE9J3tKvBAoGBALPC\n081IiYG55FFuMTmsWm42C0neD1HKelYsDshhCRWaWd6aoIuZ+O2lkifKpi9hmXzr\nALaH/5QnnUxXzNkrb3cp9SaRGKgAxZPLHqHXhOxX4bI4/yyVMC3B64+QfWpdsaaM\nkUZw9l0kqjJhKi+BgFUjiAcFwhcAZI4cBu9YoWOlAoGBAJAHfc16UX3MFNewiJHm\nQnUm9+7CDbMUzGwZmoG2xSfSlwPODgVD1Hxlhj/W1QA568kWGRNN5ubo7KCWeqSP\nZ1gBTvaxl3DgwBdenCvE+e0UF82ocmCqxSgm07v99nqMy2RmfbN73wx5lDbfNazp\nPpMrTNwq+ZA9QzRl3WQ89Atm"

# Set Google Drive folder ID
firebase functions:config:set google.drive_folder_id="1j2BGshcEHYfydq0diPo8EXiL_8FKw9cX"

# Set Google Meet API key
firebase functions:config:set google.meet_api_key="AIzaSyBx5b8gAYj6zqbIvSAiV9KUVPFpwtrzSXY"

# Set Google Speech-to-Text API key
firebase functions:config:set google.speech_to_text_api_key="AIzaSyCb8DxlENh-LjqvD-m99Bm8bK0cXt0hLJU"

# Set Google Drive API key
firebase functions:config:set google.drive_api_key="AIzaSyDLu8gn2Eo2SCITIMh5u72bInoEpvgnqO4"

# Set webhook API key (generate a random one if you don't have one)
firebase functions:config:set google.webhook_key="ftfc-meeting-webhook-key-$(openssl rand -hex 8)"

# Print the current configuration
firebase functions:config:get
