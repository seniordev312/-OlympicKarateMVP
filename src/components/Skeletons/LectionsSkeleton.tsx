import {DEFAULT_NUM_SKELETON_ITEMS} from '@common';
import React, {FC, useMemo} from 'react';
import {ScrollView} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type LectionsSkeletonProps = {
  numItems?: number;
  style?: any;
};
export const LectionsSkeleton: FC<LectionsSkeletonProps> = ({numItems}) => {
  const renderLectionItemSkeleton = (i: number) => {
    return (
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="stretch"
        key={i}
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

  const lectionItems = useMemo(
    () =>
      Array.from(Array(numItems ?? DEFAULT_NUM_SKELETON_ITEMS).keys()).map(
        renderLectionItemSkeleton,
      ),
    [numItems],
  );

  return (
    <SkeletonPlaceholder
      backgroundColor={backgroundColor}
      highlightColor={highLightColor}>
      {/* Lection Category */}
      <SkeletonPlaceholder.Item
        flexDirection="column"
        alignItems="flex-start"
        marginBottom={40}>
        <SkeletonPlaceholder.Item
          width={280}
          height={24}
          borderRadius={4}
          marginTop={10}
          marginBottom={14}
        />
        <SkeletonPlaceholder.Item
          width={240}
          height={20}
          borderRadius={4}
          marginBottom={4}
        />
        <SkeletonPlaceholder.Item
          width={220}
          height={20}
          borderRadius={4}
          marginBottom={4}
        />
        <SkeletonPlaceholder.Item
          width={200}
          height={20}
          borderRadius={4}
          marginBottom={4}
        />
      </SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
        <SkeletonPlaceholder.Item width={120} height={18} borderRadius={4} />
      </SkeletonPlaceholder.Item>
      {/* LectionItem */}
      <ScrollView>{lectionItems}</ScrollView>
    </SkeletonPlaceholder>
  );
};

// const maxHeight = 200;
const backgroundColor = '#e2e2e2';
const highLightColor = '#f5f5f5';
