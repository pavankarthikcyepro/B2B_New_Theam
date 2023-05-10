import React, { useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { Colors } from '../../../styles';
import { IconButton } from 'react-native-paper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearRecordedCallsData, getRecordedCallList } from '../../../redux/recordedCallsReducer';
import { LoaderComponent } from '../../../components';
import moment from 'moment';
import TrackPlayer, { Event, RepeatMode, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { showToast } from '../../../utils/toast';

let previousPosition = null;
let previousActiveIndex = null;
let showLoader = true;

const RecordedCalls = ({ navigation, route }) => {
  const { taskId } = route.params;
  const { position, duration } = useProgress(500);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.recordedCallsReducer);

  const [recordingList, setRecordingList] = useState([]);
  const [onSliding, setOnSliding] = useState(false);

  useEffect(() => {
    dispatch(getRecordedCallList(taskId));
    return () => {
      dispatch(clearRecordedCallsData());
      setRecordingList([]);
      showLoader = true;
      resetData();
    };
  }, []);

  useEffect(async () => {
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
  }, []);

  useEffect(() => {
    if (!selector.isLoading) {
      showLoader = true;
    } else {
      showLoader = false;
    }
  }, [selector.isLoading]);

  useEffect(() => {
    if (
      (previousPosition == 0 ||
        previousPosition == null ||
        previousPosition > position)
    ) {
      if (recordingList.length > 0 && !onSliding) {
        previousPosition = 0;
        const element = recordingList;
        let playingIndex = element.findIndex((val) => val.isPlay == true);
        if (playingIndex >= 0 && position != 0 && duration != 0) {
          element[playingIndex].currentDuration = position;
        }
      }
    }
  }, [position, duration]);

  useEffect(async () => {
    if (selector.recordedCallList.length > 0) {
      let currentTrackArr = [];
      const element = selector.recordedCallList;
      for (let i = 0; i < element.length; i++) {
        const currentTrackObj = {
          ...element[i],
          currentDuration: 0,
          duration: element[i].duration ? Number(element[i].duration) : 0,
          isPlay: false,
          isMute: false,
        };
        currentTrackArr.push(Object.assign({}, currentTrackObj));
      }
      setRecordingList([...currentTrackArr]);
    }
  }, [selector.recordedCallList]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    previousPosition = event.position;
  });

  const resetData = () => {
    setOnSliding(false);
    TrackPlayer.reset();
    previousPosition = null;
    previousActiveIndex = null;
  };

  const noData = () => {
    return (
      <View style={styles.noDataView}>
        <Text style={styles.noDataText}>No Records !</Text>
      </View>
    );
  };

  const itemSeparator = () => {
    return <View style={styles.itemDivider} />;
  };

  const onVolume = async (item, index) => {
    const element = recordingList;
    element[index].isMute = !element[index].isMute;
    setRecordingList([...element]);

    if (item.isMute) {
      TrackPlayer.setVolume(0);
    } else {
      TrackPlayer.setVolume(1);
    }
  };

  const onPlayerEvents = async (item, index) => {
    if (item.duration <= 0 || !item.assetUrl) {
      showToast("Recording Not Available");
      return;
    }

    const element = recordingList;
    if (previousActiveIndex != index) {
      for (let i = 0; i < element.length; i++) {
        if (index != i) {
          element[i].currentDuration = 0;
        }
      }
    }
    if (!item.isPlay) {
      for (let i = 0; i < element.length; i++) {
        element[i].isPlay = false;
      }
    }

    let isPlay = false;
    if (item.isPlay) {
      isPlay = false;
    } else {
      isPlay = true;
    }

    if (isPlay) {
      if (item.isMute) {
        TrackPlayer.setVolume(0);
      } else {
        TrackPlayer.setVolume(1);
      }
      if (previousActiveIndex != index) {
        const trackObj = {
          url: item.assetUrl,
          date: item.start,
          duration: item.duration ? Number(item.duration) : 0,
        };
        if (previousActiveIndex != null) {
          await TrackPlayer.reset();
        }
        await TrackPlayer.add([trackObj]);
      }
      await TrackPlayer.seekTo(item.currentDuration);
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }

    element[index].isPlay = isPlay;
    setRecordingList([...element]);
    previousActiveIndex = index;
  };

  const convertSecToTime = (value) => {
    return moment.utc(value * 1000).format("mm:ss");
  };

  const onSliderValueChange = (value, item, index) => {
    let element = recordingList;
    element[index].currentDuration = value;
    setRecordingList(Object.assign([], element));
  };

  const onSlideCompleted = (value, item, index) => {
    if (item.isPlay) {
      TrackPlayer.seekTo(value);
    }
  };

  const renderItem = ({ item, index }) => {
    let statusText = "NO ANSWER";
    switch (item.status) {
      case "ANSWERED":
        statusText = "ANSWER";
        break;

      default:
        statusText = item.status;
        break;
    }

    if (!statusText) {
      statusText = "NO ANSWER";
    }

    return (
      <View key={index} style={styles.itemContainer}>
        <View style={styles.numberRow}>
          <View>
            <Text style={styles.mobileNumberText}>{item.mobileNo}</Text>
            <Text style={styles.timeText}>
              {moment(item.callDateTime).format("DD/MM/YYYY hh:mm a")}
            </Text>
          </View>
          {item.internal_status == "OK" && (
            <IconButton
              icon={item.isMute ? "volume-off" : "volume-high"}
              size={25}
              onPress={() => onVolume(item, index)}
            />
          )}
        </View>

        <Text
          style={[
            styles.callStatusText,
            statusText == "ANSWER" ? { color: Colors.GREEN_V2 } : null,
          ]}
        >
          {statusText}
        </Text>

        {item.internal_status == "OK" && (
          <View style={styles.row1}>
            <IconButton
              icon={
                item.isPlay ? "pause-circle-outline" : "play-circle-outline"
              }
              size={45}
              style={styles.playIcon}
              color={Colors.LIGHT_GRAY2}
              onPress={() => onPlayerEvents(item, index)}
            />

            <View style={{ flex: 1 }}>
              <Slider
                style={styles.sliderContainer}
                value={item.currentDuration}
                maximumValue={item.duration}
                thumbTintColor={Colors.PINK}
                minimumTrackTintColor={Colors.PINK}
                maximumTrackTintColor={Colors.LIGHT_GRAY2}
                onSlidingStart={(value) => setOnSliding(true)}
                onSlidingComplete={(value) => {
                  setOnSliding(false);
                  onSlideCompleted(value, item, index);
                }}
                step={0.5}
                onValueChange={(value) =>
                  onSliderValueChange(value, item, index)
                }
              />
              <View style={styles.timeRow}>
                <Text style={[styles.durationTimeText, { marginLeft: 7 }]}>
                  {convertSecToTime(item.currentDuration)}
                </Text>
                <Text style={styles.durationTimeText}>
                  {convertSecToTime(item.duration)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recordingList}
        keyExtractor={(item, index) => item.uniqId}
        renderItem={renderItem}
        ListEmptyComponent={noData}
        contentContainerStyle={{ padding: 15 }}
        ItemSeparatorComponent={itemSeparator}
        refreshControl={
          <RefreshControl
            refreshing={showLoader && selector.isLoading}
            onRefresh={() => {
              resetData();
              dispatch(getRecordedCallList(taskId));
              showLoader = false;
            }}
            progressViewOffset={200}
            tintColor={Colors.PINK}
          />
        }
      />
      {showLoader ? <LoaderComponent visible={selector.isLoading} /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },

  itemContainer: {
    // flexDirection: "row",
    // alignItems: "center",
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
  },
  callStatusText: {
    fontSize: 12,
    color: Colors.CORAL,
    marginVertical: 5,
  },
  playIcon: {
    margin: -10,
  },
  numberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mobileNumberText: {
    fontWeight: "600",
    fontSize: 14,
  },
  timeText: {
    fontSize: 13,
    marginTop: 3,
    marginBottom: 3,
  },
  currentDurationText: {
    fontSize: 12,
    color: Colors.GRAY_LIGHT,
  },
  sliderContainer: {
    height: 50,
    width: "100%",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  durationTimeText: {
    fontWeight: "500",
    fontSize: 13,
    color: Colors.DARK_GRAY,
  },

  noDataView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.BLACK,
  },
  itemDivider: {
    height: 1,
    width: "100%",
    backgroundColor: Colors.LIGHT_GRAY2,
    marginVertical: 10,
  },
});

export default RecordedCalls;