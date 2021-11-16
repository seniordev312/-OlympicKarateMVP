import React from 'react';
import {ScrollView} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const LectionItemSkeleton = () => {
  const renderLectionItemSkeleton = () => {
    return (
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="stretch"
        justifyContent="flex-start"
        marginTop={10}>
        {/* Thumbnail */}
        <SkeletonPlaceholder.Item width={80} height={80} borderRadius={10} />
        {/* Title & Duration Wrapper */}
        <SkeletonPlaceholder.Item
          marginLeft={10}
          flexDirection={'column'}
          justifyContent={'space-around'}
          alignItems="flex-start">
          {/* Title  */}
          <SkeletonPlaceholder.Item
            marginTop={6}
            width={120}
            height={16}
            borderRadius={4}
          />
          {/* Video duration */}
          <SkeletonPlaceholder.Item
            marginTop={6}
            width={25}
            height={16}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>
        {/* Like Wrapper */}
        <SkeletonPlaceholder.Item
          marginLeft={10}
          flex={1}
          flexDirection={'row-reverse'}
          justifyContent={'flex-start'}
          alignItems="center">
          {/* Like */}
          <SkeletonPlaceholder.Item
            marginTop={6}
            width={14}
            height={14}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    );
  };

  return (
    <SkeletonPlaceholder
      backgroundColor={backgroundColor}
      highlightColor={highLightColor}>
      {/* LectionItem */}
      <ScrollView>{renderLectionItemSkeleton()}</ScrollView>
    </SkeletonPlaceholder>
  );
};
const backgroundColor = '#e2e2e2';
const highLightColor = '#f5f5f5';
