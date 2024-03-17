<template>
  <van-barrage>
    <div class="video">
      <video width="1280" height="720" autoplay="" playsinline=""></video>
    </div>
  </van-barrage>
  <van-space style="margin-top: 10px">
    <van-button @click="myAppActions.connectWithFormInput()" type="primary" size="small">连接</van-button>
  </van-space>
</template>
<script setup lang="ts">
import {LogLevel, setLogLevel} from "@/components/live/logger";
import {RoomConnectOptions, RoomOptions} from "@/components/live/options";
import Room from "@/components/live/room/Room";
import {RoomEvent} from "@/components/live/room/LiveEvents";
import Participant from "@/components/live/room/participant/Participant";
import {AccessToken} from "@/components/live/token/AccessToken";
import {ScreenSharePresets, VideoPresets} from "@/components/live";

onMounted(() => {
  // const url = "ws://localhost:7880";
  // const t = new AccessToken("devkey", "secret", {
  //   identity: 'me',
  //   name: 'myname',
  // });
  // t.addGrant({
  //   roomCreate: true,
  //   roomJoin: true,
  //   canPublish: true,
  //   canSubscribe: true,
  // });
  // console.info("toJwt");
  // console.info((t.toJwt()).toString());
  // const token = (t.toJwt()).toString();
  //
  // // 房间配置
  // const roomOpts: RoomOptions = {};
  // // 链接配置
  // const connectOpts: RoomConnectOptions = {};
  // myAppActions.connectToRoom(url, token, roomOpts, connectOpts, true);
  // console.info("connect succeed");
})
let currentRoom: Room | undefined;

const myAppActions = {
  connectWithFormInput: async (): Promise<Room | undefined> => {
    setLogLevel(LogLevel.debug);
    const url = "ws://localhost:7880";
    const t = new AccessToken("devkey", "secret", {
      identity: 'me',
      name: 'myname',
    });
    t.addGrant({
      roomCreate: true,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });
    console.info("toJwt");
    const token = (await (t.toJwt())).toString();
    console.info(token);
    const adaptiveStream = false;
    const simulcast = false;
    const dynacast = false;
    // 房间配置
    const roomOpts: RoomOptions = {
      adaptiveStream,
      dynacast,
      audioOutput: {
        deviceId: "",
      },

      publishDefaults: {
        simulcast,
        videoSimulcastLayers: [VideoPresets.h90, VideoPresets.h216],
        videoCodec: 'vp8',
        dtx: true,
        red: true,
        forceStereo: false,
        screenShareEncoding: ScreenSharePresets.h1080fps30.encoding,
      },
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
      e2ee: undefined,
    };
    // 链接配置
    const connectOpts: RoomConnectOptions = {
      autoSubscribe: true,
    };
    await myAppActions.connectToRoom(url, token, roomOpts, connectOpts, true);
  },
  connectToRoom: async (
      url: string,
      token: string,
      roomOptions?: RoomOptions,
      connectOptions?: RoomConnectOptions,
      shouldPublish?: boolean,
  ): Promise<Room | undefined> => {
    // 根据房间参数创建房间
    console.info("connectToRoom");
    // 根据房间参数创建房间
    const room = new Room(roomOptions);
    // 记录房间的创建时间
    let startTime = Date.now();
    // 和Server进行交互
    await room.prepareConnection(url, token);
    const preWarmTime = Date.now() - startTime;
    console.info("preWarmed connection in " + preWarmTime + " ms");
    room.on(RoomEvent.ParticipantConnected, participantConnected)
        .on(RoomEvent.Reconnecting, () => {
          console.info('Reconnecting to Room');
        })
        .on(RoomEvent.Reconnected, async () => {
          console.info("Successfully reconnected. server=" + (await room.engine.getConnectedServerAddress()));
        })
        .on(RoomEvent.SignalConnected, async () => {
          const signalConnectionTime = Date.now() - startTime;
          console.info(`signal connection established in ${signalConnectionTime} ms`);
          if (shouldPublish) {
            console.info(`shouldPublish enableCameraAndMicrophone`);
            await room.localParticipant.enableCameraAndMicrophone();
            console.info(`tracks published in ${Date.now() - startTime} ms`);
          }
        });
    try {
      // 链接到server
      await room.connect(url, token, connectOptions);
      const elapsed = Date.now() - startTime;
      console.info(`successfully connected to ${room.name} in ${Math.round(elapsed)} ms,` + (await room.engine.getConnectedServerAddress()),);
    } catch (error: any) {
      let message: any = error;
      if (error.message) {
        message = error.message;
      }
      console.info('could not connect:' + message);
      return;
    }
    // 房间赋值
    currentRoom = room;
    // window对象赋值
    window.currentRoom = room;

    room.remoteParticipants.forEach((participant) => {
      participantConnected(participant);
    });
  },

  toggleAudio: async () => {
    console.info("toggleAudio");
  },

  toggleVideo: async () => {
    console.info("toggleVideo");
  },

  flipVideo: () => {
    console.info("flipVideo");
  },

  shareScreen: async () => {
    console.info("shareScreen");
  },

  startAudio: () => {
    console.info("startAudio");
  },

  enterText: () => {
    console.info("enterText");
  },

  disconnectRoom: () => {
    console.info("disconnectRoom");
  },

  handleScenario: (e: Event) => {
    console.info("handleScenario");
  },

  handleDeviceSelected: async (e: Event) => {
    console.info("handleDeviceSelected");
  },

  handlePreferredQuality: (e: Event) => {
    console.info("handlePreferredQuality");
  },

  handlePreferredFPS: (e: Event) => {
    console.info("handlePreferredFPS");
  },
}

function participantConnected(participant: Participant) {
  console.info('participantConnected, identity=' + participant.identity + ", connected=" + participant.metadata);
}

</script>