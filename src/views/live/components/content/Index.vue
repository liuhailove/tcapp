<template>
  <van-barrage>
    <div class="video" style="width: 100%; height: 400px"></div>
  </van-barrage>
  <van-space style="margin-top: 10px">
    <van-button @click="myAppActions.connectWithFormInput()" type="primary" size="small"> 弹幕</van-button>
  </van-space>
</template>
<script setup lang="ts">
import {ScreenSharePresets, VideoCaptureOptions, VideoCodec, VideoPresets} from "@/components/live/room/track/options";
import {LogLevel, setLogLevel} from "@/components/live/logger";
import {RoomConnectOptions, RoomOptions} from "@/components/live/options";
import Room from "@/components/live/room/Room";
import {RoomEvent} from "@/components/live/room/LiveEvents";
import LocalAudioTrack from "@/components/live/room/track/LocalAudioTrack";
import {createAudioAnalyser} from "@/components/live/room/utils";
import {MediaDeviceFailure} from "@/components/live/room/errors";
import Participant, {ConnectionQuality} from "@/components/live/room/participant/Participant";
import {Track} from "@/components/live/room/track/Track";
import {DataPacket_Kind, VideoQuality} from "@/components/live/protocol/tc_models_pb";
import {SimulateScenario} from "@/components/live/protocol/tc_rtc_pb";
import {AccessToken} from "@/components/live/token/AccessToken";

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
const myAppActions = {
  connectWithFormInput: async (): Promise<Room | undefined> => {
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
    const token =  (await (t.toJwt())).toString();
    console.info(token);
    // 房间配置
    const roomOpts: RoomOptions = {};
    // 链接配置
    const connectOpts: RoomConnectOptions = {};
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
    await room.prepareConnection(url);
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