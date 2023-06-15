const generateSystemResponse = (userMessage, context) => {
    
    // assume user types genes in space separated format
    // if (userMessage.includes('CAR4') || userMessage.includes('CD19')) {
    //     const userGeneList = userMessage.split(' ');
    //     updateGeneList(userGeneList);
    //     return 'Heatmap updated';
    // }

    let response = await ask("question", context);

    return '(echo) ' + userMessage;
}

export default generateSystemResponse
