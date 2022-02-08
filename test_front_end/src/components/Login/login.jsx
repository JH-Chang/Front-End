import MetaMaskOnboarding from '@metamask/onboarding';
import React, {useEffect,useState} from 'react';
import Button from "@mui/material/Button"

const ONBOARD_TEXT = 'Click here to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Check your profile';

export function OnboardingButton(){
    const [isLogging, setIsLogging] = useState(false);
    const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
    const [isDisabled, setDisabled] = useState(false);
    const [accounts, setAccounts] = useState("");

    const onboarding = React.useRef();

    useEffect(() => {
        if(!onboarding.current){
           onboarding.current = new MetaMaskOnboarding();
        }
    },[]);

    useEffect(()    => {
        function handleNewAccounts(newAccounts){
            setAccounts(newAccounts);
        }
        if (MetaMaskOnboarding.isMetaMaskInstalled()){
            window.ethereum
                .request({ method: "eth_requestAccounts"})
                .then(handleNewAccounts);
            window.ethereum.on('accountsChanged', handleNewAccounts);
            console.log(accounts[0]);
        }
    }, [accounts]);

    useEffect(()=> {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (accounts.length > 0) {
                setButtonText(CONNECTED_TEXT);
                setDisabled(true);
                setIsLogging(true);
                onboarding.current.stopOnboarding();
            }
            else{
                setButtonText(CONNECT_TEXT);
                setDisabled(false);
            }
        }
    },[accounts]);

    const onClick = () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then((newAccounts) => setAccounts(newAccounts));
        } else {
            onboarding.current.startOnboarding();
        }
     };
    return (
        <div>
            {
                !isLogging &&
                    <Button variant = 'contained' disabled={isDisabled} onClick={onClick}>
                        {buttonText}
                    </Button>
            }
            {
                isLogging &&
                    <Button variant = 'contained' href="/profile">
                        {buttonText}
                    </Button>
            }
        </div>
    );
}