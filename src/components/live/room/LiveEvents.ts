/**
 * 事件是 TcApp 通知应用程序更改的主要方式。
 *
 * 以下是[[Room]]发出的事件，监听房间事件，例如
 *
 * ```typescript
 * room.on(RoomEvent.TrackPublished, (跟踪、发布、参与者) => {})
 * ````
 */
export enum RoomEvent {
    /**
     * 当与服务器的连接建立时
     */
    Connected = 'connected',

    /**
     * 当与服务器的连接已中断并且正在尝试时
     * 重新连接。
     */
    Reconnecting = 'reconnecting',

    /**
     * 重新连接成功时触发。
     */
    Reconnected = 'reconnected',

    /**
     * 当与房间断开连接时。 当 room.disconnect() 被调用或
     * 当发生不可恢复的连接问题时
     */
    Disconnected = 'disconnected',

    /**
     * 每当房间的连接状态发生变化时
     *
     * 参数：([[ConnectionState]])
     */
    ConnectionStateChanged = 'connectionStateChanged',

    /**
     * @deprecated StateChanged 已重命名为 ConnectionStateChanged
     */
    StateChanged = 'connectionStateChanged',

    /**
     * 当机器上的输入或输出设备发生变化时。
     */
    MediaDevicesChanged = 'mediaDevicesChanged',

    /**
     * 当 [[RemoteParticipant]] 加入*之后*本地
     * 参与者。 它不会为已经存在的参与者发出事件
     * 在房间里
     *
     * 参数：([[RemoteParticipant]])
     */
    ParticipantConnected = 'participantConnected',

    /**
     * 当本地参与者加入后，[[RemoteParticipant]] 离开。
     *
     * 参数：([[RemoteParticipant]])
     */
    ParticipantDisconnected = 'participantDisconnected',

    /**
     * 当本地参与者加入*之后*将新曲目发布到房间时。 对于已经发布的曲目，它不会触发。
     *
     * 曲目已发布并不意味着参与者已订阅它。 它只是反映了房间的状态。
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    TrackPublished = 'trackPublished',

    /**
     * [[LocalParticipant]] 已订阅新曲目。 只要新轨道可供使用，此事件就会**始终**触发。
     *
     * args: ([[RemoteTrack]], [[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    TrackSubscribed = 'trackSubscribed',

    /**
     * 无法订阅曲目
     *
     * args: (轨道 sid, [[RemoteParticipant]])
     */
    TrackSubscriptionFailed = 'trackSubscriptionFailed',

    /**
     * [[RemoteParticipant]] 已取消发布曲目
     *
     * args: ([[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    TrackUnpublished = 'trackUnpublished',

    /**
     * 订阅的曲目不再可用。 客户端应该监听此事件并确保他们分离轨道。
     *
     * args: ([[Track]], [[RemoteTrackPublication]], [[RemoteParticipant]])
     */
    TrackUnsubscribed = 'trackUnsubscribed',

    /**
     * A track that was muted, fires on both [[RemoteParticipant]]s and [[LocalParticipant]]
     *
     * args: ([[TrackPublication]], [[Participant]])
     */
    TrackMuted = 'trackMuted',

    /**
     * 未静音的曲目会在 [[RemoteParticipant]] 和 [[LocalParticipant]] 上触发
     *
     * args: ([[TrackPublication]], [[参与者]])
     */
    TrackUnmuted = 'trackUnmuted',

    /**
     * 本地曲目已成功发布。 此事件有助于了解何时使用新发布的曲目更新本地 UI。
     *
     * args: ([[LocalTrackPublication]], [[LocalParticipant]])
     */
    LocalTrackPublished = 'localTrackPublished',

    /**
     * 本地曲目取消发布。 此事件有助于了解何时从 UI 中删除本地轨道。
     *
     * 当用户通过按浏览器 UI 上的“结束”停止共享屏幕时，也会触发此事件。
     *
     * args: ([[LocalTrackPublication]], [[LocalParticipant]])
     */
    LocalTrackUnpublished = 'localTrackUnpublished',

    /**
     * 发布本地音轨时，SDK 会检查该音轨是否完全静音，并在这种情况下发出 LocalAudioSilenceDetected 事件。
     * 这允许应用程序显示 UI，通知用户他们可能必须重置音频硬件或检查设备连接是否正确。
     */
    LocalAudioSilenceDetected = 'localAudioSilenceDetected',

    /**
     * 有源扬声器发生变化。 发言者列表按其音频级别排序。声音最大的发言者排在第一位。 这也将包括 LocalParticipant。
     *
     * 演讲者更新仅发送给发布参与者及其订阅者。
     *
     * args: (数组<[[参与者]]>)
     */
    ActiveSpeakersChanged = 'activeSpeakersChanged',

    /**
     * 参与者元数据是一种将应用程序特定状态推送到的简单方法
     * 全部用户。
     * 当调用 RoomService.UpdateParticipantMetadata 来更改参与者的
     * 声明，房间中的“所有”参与者都将触发此事件。
     *
     * args: (prevMetadata: 字符串, [[参与者]])
     *
     */
    ParticipantMetadataChanged = 'participantMetadataChanged',

    /**
     * 参与者的显示名称已更改
     *
     * args: (名称: 字符串, [[参与者]])
     *
     */
    ParticipantNameChanged = 'participantNameChanged',

    /**
     * 房间元数据是将应用程序特定状态推送给所有用户的简单方法。
     * 当调用 RoomService.UpdateRoomMetadata 来改变房间的状态时，
     * *房间中的所有*参与者都将触发此事件。
     *
     * 参数：（字符串）
     */
    RoomMetadataChanged = 'roomMetadataChanged',

    /**
     * 从另一位参与者收到的数据。
     * 数据包提供了使用 TcApp 发送/接收任意负载的能力。
     * 房间内的所有参与者都会收到发送到房间的消息。
     *
     * args：（有效负载：Uint8Array，参与者：[[Participant]]，种类：[[DataPacket_Kind]]，主题？：字符串）
     */
    DataReceived = 'dataReceived',

    /**
     * 参与者的连接质量已更改。 它将接收来自本地参与者以及我们订阅的任何 [[RemoteParticipant]] 的更新。
     *
     * args: (连接质量: [[连接质量]], 参与者: [[参与者]])
     */
    ConnectionQualityChanged = 'connectionQualityChanged',

    /**
     * StreamState 指示订阅的（远程）轨道是否已被 SFU 暂停（通常由于订阅者的带宽限制而发生这种情况）
     *
     * 当带宽条件允许时，曲目将自动恢复。
     * 当发生这种情况时，TrackStreamStateChanged 也会被发出。
     *
     * 参数：（pub：[[RemoteTrackPublication]]，streamState：[[Track.StreamState]]，
     * 参与者：[[RemoteParticipant]])
     */
    TrackStreamStateChanged = 'trackStreamStateChanged',

    /**
     * 订阅的曲目之一已更改当前参与者的权限。 如果许可被撤销，则该曲目将不再被订阅。 如果授予权限，将发出 TrackSubscribed 事件。
     *
     * args: (pub: [[RemoteTrackPublication]],
     * 状态: [[TrackPublication.SubscriptionStatus]],
     * 参与者：[[RemoteParticipant]])
     */
    TrackSubscriptionPermissionChanged = 'trackSubscriptionPermissionChanged',

    /**
     * 当前参与者的订阅曲目之一已更改其状态。
     *
     * args: (pub: [[RemoteTrackPublication]],
     * 状态: [[TrackPublication.SubscriptionStatus]],
     * 参与者：[[RemoteParticipant]])
     */
    TrackSubscriptionStatusChanged = 'trackSubscriptionStatusChanged',

    /**
     * 当您将所有音轨附加到音频元素时，TcApp 将尝试自动播放它们。 但是，如果失败，我们将通过 AudioPlaybackStatusChanged 通知您。
     * `Room.canPlayAudio` 将指示是否允许音频播放。
     */
    AudioPlaybackStatusChanged = 'audioPlaybackChanged',

    /**
     * TCApp will attempt to autoplay all video tracks when you attach them to
     * a video element. However, if that fails, we'll notify you via VideoPlaybackStatusChanged.
     * Calling `room.startVideo()` in a user gesture event handler will resume the video playback.
     */
    VideoPlaybackStatusChanged = 'videoPlaybackChanged',

    /**
     * 当我们在尝试创建曲目时遇到错误时。
     * 错误发生在 getUserMedia() 中。
     * 使用 MediaDeviceFailure.getFailure(error) 获取失败原因。
     * [[LocalParticipant.lastCameraError]] 和 [[LocalParticipant.lastMicrophoneError]]
     * 将指示分别创建音频或视频轨道时是否出现错误。
     *
     * 参数：(error: Error)
     */
    MediaDevicesError = 'mediaDevicesError',

    /**
     * 参与者的权限已更改。 目前仅在 LocalParticipant 上触发。
     * args: (prevPermissions: [[ParticipantPermission]], 参与者: [[Participant]])
     */
    ParticipantPermissionsChanged = 'participantPermissionsChanged',

    /**
     * 信号已连接，可以发布曲目。
     */
    SignalConnected = 'signalConnected',

    /**
     * 房间录制已开始/停止。 Room.isRecording 也会更新。
     * args: (isRecording: 布尔值)
     */
    RecordingStatusChanged = 'recordingStatusChanged',

    /**
     * 每当数据通道的当前缓冲区状态发生变化时发出
     * args：（isLow：布尔值，种类：[[DataPacket_Kind]]）
     */
    DCBufferStatusChanged = 'dcBufferStatusChanged',

    ParticipantEncryptionStatusChanged = 'participantEncryptionStatusChanged',

    EncryptionError = 'encryptionError',
    /**
     * Emits whenever the current buffer status of a data channel changes
     * args: (isLow: boolean, kind: [[DataPacket_Kind]])
     */
    DCBufferStatusChanged = 'dcBufferStatusChanged',

    /**
     * Triggered by a call to room.switchActiveDevice
     * args: (kind: MediaDeviceKind, deviceId: string)
     */
    ActiveDeviceChanged = 'activeDeviceChanged',
}

export enum ParticipantEvent {

    /**
     * 当本地参与者加入*之后*将新曲目发布到房间时。 对于已经发布的曲目，它不会触发。
     *
     * 曲目已发布并不意味着参与者已订阅它。 它只是反映了房间的状态。
     *
     * 参数：([[RemoteTrackPublication]])
     */
    TrackPublished = 'trackPublished',

    /**
     * 已成功订阅 [[RemoteParticipant]] 的曲目。
     * 只要新曲目可供使用，此事件就会**始终**触发。
     *
     * args: ([[RemoteTrack]], [[RemoteTrackPublication]])
     */
    TrackSubscribed = 'trackSubscribed',

    /**
     * 无法订阅曲目
     *
     * args: (轨道 sid)
     */
    TrackSubscriptionFailed = 'trackSubscriptionFailed',

    /**
     * [[RemoteParticipant]] 已取消发布曲目
     *
     * 参数：([[RemoteTrackPublication]])
     */
    TrackUnpublished = 'trackUnpublished',

    /**
     * 订阅的曲目不再可用。 客户端应该监听此事件并确保他们分离轨道。
     *
     * args: ([[RemoteTrack]], [[RemoteTrackPublication]])
     */
    TrackUnsubscribed = 'trackUnsubscribed',

    /**
     * 静音的曲目会在 [[RemoteParticipant]] 和 [[LocalParticipant]] 上触发
     *
     * 参数: ([[TrackPublication]])
     */
    TrackMuted = 'trackMuted',

    /**
     * 未静音的曲目会在 [[RemoteParticipant]] 和 [[LocalParticipant]] 上触发
     *
     * 参数: ([[TrackPublication]])
     */
    TrackUnmuted = 'trackUnmuted',

    /**
     * 本地曲目已成功发布。 此事件有助于了解何时使用新发布的曲目更新本地 UI。
     *
     * 参数: ([[LocalTrackPublication]])
     */
    LocalTrackPublished = 'localTrackPublished',

    /**
     * 本地曲目未发布。 此事件有助于了解何时从 UI 中删除本地轨道。
     *
     * 当用户通过按浏览器 UI 上的“结束”停止共享屏幕时，也会触发此事件。
     *
     * 参数: ([[LocalTrackPublication]])
     */
    LocalTrackUnpublished = 'localTrackUnpublished',

    /**
     * 参与者元数据是将应用程序特定状态推送给所有用户的简单方法。
     * 当调用 RoomService.UpdateParticipantMetadata 来更改参与者的状态时，房间中的*所有*参与者都会触发此事件。
     * 要访问当前元数据，请参阅 [[Participant.metadata]]。
     *
     * args: (prevMetadata: 字符串)
     *
     */
    ParticipantMetadataChanged = 'participantMetadataChanged',

    /**
     * 参与者的显示名称已更改
     *
     * args: (名称: 字符串, [[参与者]])
     *
     */
    ParticipantNameChanged = 'participantNameChanged',

    /**
     * 从该参与者作为发送者收到的数据。
     * 数据包提供了使用 TcApp 发送/接收任意负载的能力。
     * 房间内的所有参与者都会收到发送到房间的消息。
     *
     * args：（有效负载：Uint8Array，种类：[[DataPacket_Kind]]）
     */
    DataReceived = 'dataReceived',

    /**
     * 当前参与者的发言状态是否已更改
     *
     * args: (speaking: boolean)
     */
    IsSpeakingChanged = 'isSpeakingChanged',

    /**
     * 参与者的连接质量已更改。 它将接收来自本地参与者以及我们订阅的任何 [[RemoteParticipant]] 的更新。
     *
     *   * args: (connectionQuality: [[ConnectionQuality]])
     */
    ConnectionQualityChanged = 'connectionQualityChanged',

    /**
     * StreamState 指示订阅的曲目是否已被 SFU 暂停
     *（通常发生这种情况是因为订户的带宽限制）
     *
     * 当带宽条件允许时，曲目将自动恢复。
     * 当发生这种情况时，TrackStreamStateChanged 也会被发出。
     *
     * 参数：（pub：[[RemoteTrackPublication]]，streamState：[[Track.StreamState]]）
     */
    TrackStreamStateChanged = 'trackStreamStateChanged',

    /**
     * 订阅的曲目之一已更改当前参与者的权限。
     * 如果许可被撤销，则该曲目将不再被订阅。
     * 如果授予权限，将发出 TrackSubscribed 事件。
     *
     * args: (pub: [[RemoteTrackPublication]],
     * status: [[TrackPublication.SubscriptionStatus]])
     */
    TrackSubscriptionPermissionChanged = 'trackSubscriptionPermissionChanged',

    /**
     * 远程参与者出版物之一已更改其订阅状态。
     *
     */
    TrackSubscriptionStatusChanged = 'trackSubscriptionStatusChanged',

    /**
     *  仅在 LocalParticipant 上触发
     */
    /** @internal */
    MediaDevicesError = 'mediaDevicesError',

    // fired only on LocalParticipant
    /** @internal */
    AudioStreamAcquired = 'audioStreamAcquired',

    /**
     * 参与者的权限已更改。 目前仅在 LocalParticipant 上触发。
     * args: (prevPermissions: [[ParticipantPermission]])
     */
    ParticipantPermissionsChanged = 'participantPermissionsChanged',

    /** @internal */
    PCTrackAdded = 'pcTrackAdded',
}

/**
 * @内部
 */
export enum EngineEvent {
    TransportsCreated = 'transportsCreated',
    Connected = 'connected',
    Disconnected = 'disconnected',
    Resuming = 'resuming',
    Resumed = 'resumed',
    Restarting = 'restarting',
    Restarted = 'restarted',
    SignalResumed = 'signalResumed',
    SignalRestarted = 'signalRestarted',
    Closing = 'closing',
    MediaTrackAdded = 'mediaTrackAdded',
    ActiveSpeakersUpdate = 'activeSpeakersUpdate',
    DataPacketReceived = 'dataPacketReceived',
    RTPVideoMapUpdate = 'rtpVideoMapUpdate',
    DCBufferStatusChanged = 'dcBufferStatusChanged',
    ParticipantUpdate = 'participantUpdate',
    RoomUpdate = 'roomUpdate',
    SpeakersChanged = 'speakersChanged',
    StreamStateChanged = 'streamStateChanged',
    ConnectionQualityUpdate = 'connectionQualityUpdate',
    SubscriptionError = 'subscriptionError',
    SubscriptionPermissionUpdate = 'subscriptionPermissionUpdate',
    RemoteMute = 'remoteMute',
    SubscribedQualityUpdate = 'subscribedQualityUpdate',
    LocalTrackUnpublished = 'localTrackUnpublished',
    Offline = 'offline',
}

export enum TrackEvent {
    Message = 'message',
    Muted = 'muted',
    Unmuted = 'unmuted',
    /**
     * 仅在 LocalTracks 上触发
     */
    Restarted = 'restarted',
    Ended = 'ended',
    Subscribed = 'subscribed',
    Unsubscribed = 'unsubscribed',
    /** @internal */
    UpdateSettings = 'updateSettings',
    /** @internal */
    UpdateSubscription = 'updateSubscription',
    /** @internal */
    AudioPlaybackStarted = 'audioPlaybackStarted',
    /** @internal */
    AudioPlaybackFailed = 'audioPlaybackFailed',
    /**
     * @内部的
     * 仅在 LocalAudioTrack 实例上触发
     */
    AudioSilenceDetected = 'audioSilenceDetected',
    /** @internal */
    VisibilityChanged = 'visibilityChanged',
    /** @internal */
    VideoDimensionsChanged = 'videoDimensionsChanged',
    /** @internal */
    VideoPlaybackStarted = 'videoPlaybackStarted',
    /** @internal */
    VideoPlaybackFailed = 'videoPlaybackFailed',
    /** @internal */
    ElementAttached = 'elementAttached',
    /** @internal */
    ElementDetached = 'elementDetached',
    /**
     * @内部的
     * 仅在 LocalTracks 上触发
     */
    UpstreamPaused = 'upstreamPaused',
    /**
     * @internal
     * Only fires on LocalTracks
     */
    UpstreamResumed = 'upstreamResumed',
    /**
     * @内部的
     * 在 RemoteTrackPublication 上触发
     */
    SubscriptionPermissionChanged = 'subscriptionPermissionChanged',
    /**
     * 在 RemoteTrackPublication 上触发
     */
    SubscriptionStatusChanged = 'subscriptionStatusChanged',
    /**
     * 在 RemoteTrackPublication 上触发
     */
    SubscriptionFailed = 'subscriptionFailed',

    TrackProcessorUpdate = 'trackProcessorUpdate',
}