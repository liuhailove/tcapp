const tcAppActions = {
    connectWithFromInput: async () => {
        console.info("连接成功")
    },
    connectToRoom: async (
        url: string,
        token: string,
        shouldPublish?: boolean,
    ): Promise<string | undefined> => {

    }

}

export default tcAppActions;