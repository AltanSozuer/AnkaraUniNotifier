const generateAxiosConfig = ({
    url,
    accessToken
}: {url: string, accessToken: string}) => {
    return {
        method: 'GET',
        url: url,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "application/json"
        }
    }
}

export default generateAxiosConfig;