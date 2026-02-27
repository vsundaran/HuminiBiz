import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { CustomDatePicker } from '../components/CustomDatePicker';

import { COLORS, FONTS } from '../theme';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { DropdownArrowIcon } from '../components/icons/DropdownArrowIcon';
import { AnimatedScreen, AnimatedView, AnimatedPressable } from '../components/animated';
import { Shadow } from 'react-native-shadow-2';

// ─── Types ───────────────────────────────────────────────────────────────────
type Category = 'Wishes' | 'Celebration' | 'Motivation' | 'Others';

// ─── Sub-category data per category ──────────────────────────────────────────
const SUBCATEGORIES: Record<Category, string[]> = {
  Wishes: [
    'Birthday',
    'Work anniversary',
    'Marriage anniversary',
    'New Joinee',
    'Last day of work / farewell',
  ],
  Celebration: [
    'Promotion',
    'Achievement',
    'Work anniversary',
    'Marriage anniversary',
    'New Joinee',
  ],
  Motivation: [
    'Deadline stress',
    'Personal struggle',
    'Career guidance',
    'Encouragement',
  ],
  Others: [
    'General moment',
    'Surprise moment',
    'Custom event',
  ],
};

// ─── Time slots (every 30m, 6AM–11:30PM) ─────────────────────────────────────
function buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 6; h <= 23; h++) {
    const period = h < 12 ? 'AM' : 'PM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push(`${displayH}:00${period}`);
    if (h < 23) {
      slots.push(`${displayH}:30${period}`);
    }
  }
  return slots;
}
const TIME_SLOTS = buildTimeSlots();

// ─── Duration calculator ─────────────────────────────────────────────────────
function parseTo24h(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)(AM|PM)/);
  if (!match) { return 0; }
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const period = match[3];
  if (period === 'AM' && h === 12) { h = 0; }
  if (period === 'PM' && h !== 12) { h += 12; }
  return h * 60 + m;
}

function calcDuration(start: string, end: string): string {
  const startMin = parseTo24h(start);
  const endMin = parseTo24h(end);
  const diff = endMin - startMin;
  if (diff <= 0) { return ''; }
  if (diff < 60) { return `(${diff}m)`; }
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  return mins === 0 ? `(${hours}h)` : `(${hours}h ${mins}m)`;
}

// ─── Category chip config ─────────────────────────────────────────────────────
const CATEGORY_CONFIG: {
  key: Category;
  label: string;
  bg: string;
  selectedBorder: string;
  textColor: string;
}[] = [
  {
    key: 'Wishes',
    label: 'Wishes',
    bg: '#E3F2D9',
    selectedBorder: '#486333',
    textColor: '#486333',
  },
  {
    key: 'Celebration',
    label: 'Celebration',
    bg: '#FCECFF',
    selectedBorder: '#5D4D60',
    textColor: '#5D4D60',
  },
  {
    key: 'Motivation',
    label: 'Motivation',
    bg: '#FFEAEA',
    selectedBorder: '#705B5B',
    textColor: '#705B5B',
  },
  {
    key: 'Others',
    label: 'Others',
    bg: '#F3F3F3',
    selectedBorder: '#515B60',
    textColor: '#515B60',
  },
];

// ─── Format date as DD-MM-YYYY ────────────────────────────────────────────────
function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const CreateMomentScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<Category>('Wishes');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>('9:30AM');
  const [endTime, setEndTime] = useState<string>('10:00AM');

  // Modal visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSubCatModal, setShowSubCatModal] = useState(false);
  const [showStartTimeModal, setShowStartTimeModal] = useState(false);
  const [showEndTimeModal, setShowEndTimeModal] = useState(false);



  const duration = useMemo(() => calcDuration(startTime, endTime), [startTime, endTime]);

  const handleCategoryChange = useCallback((cat: Category) => {
    setSelectedCategory(cat);
    setSelectedSubCategory(''); // reset sub-cat on category change
  }, []);

  const handleDescriptionChange = useCallback((text: string) => {
    if (text.length <= 100) {
      setDescription(text);
    }
  }, []);

  const subCategories = useMemo(
    () => SUBCATEGORIES[selectedCategory],
    [selectedCategory],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Background gradient */}
        <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFBEA" />
                <Stop offset="30%" stopColor="#F4F4F4" />
                <Stop offset="100%" stopColor="#F4F4F4" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#bgGrad)" />
          </Svg>
        </View>

        {/* Header */}
        <AnimatedView animation="slideDown" style={styles.header}>
          <AnimatedPressable
            style={styles.backBtn}
            onPress={() => navigation.navigate('Home')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ChevronLeftIcon size={24} color={COLORS.primary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Create Moment</Text>
        </AnimatedView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">

          {/* ── Select Category ── */}
          <AnimatedView animation="slideUp" delay={100} style={styles.section}>
            <Text style={styles.sectionLabel}>Select Category</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORY_CONFIG.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryChip,
                      { backgroundColor: cat.bg },
                      isSelected
                        ? { borderColor: cat.selectedBorder, borderWidth: 1.5 }
                        : { borderColor: COLORS.white, borderWidth: 1 },
                    ]}
                    onPress={() => handleCategoryChange(cat.key)}
                    activeOpacity={0.8}>
                    <Text style={[styles.categoryChipText, { color: cat.textColor }]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </AnimatedView>

          {/* ── Sub Category ── */}
          <AnimatedView animation="slideUp" delay={150} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Select sub category</Text>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setShowSubCatModal(true)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.inputText,
                  !selectedSubCategory && styles.placeholderText,
                ]}>
                {selectedSubCategory || 'Select sub category'}
              </Text>
              <DropdownArrowIcon size={20} color={COLORS.textSubHeadline} />
            </TouchableOpacity>
          </AnimatedView>

          {/* ── Description ── */}
          <AnimatedView animation="slideUp" delay={200} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Describe about your moment</Text>
            <View style={styles.descriptionContainer}>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Type here"
                placeholderTextColor="#B0B0B0"
                multiline
                value={description}
                onChangeText={handleDescriptionChange}
                maxLength={100}
                textAlignVertical="top"
              />
              <Text style={styles.charCounter}>{description.length}/100</Text>
            </View>
          </AnimatedView>

          {/* ── Start Date ── */}
          <AnimatedView animation="slideUp" delay={250} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Start date</Text>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}>
              <Text style={styles.inputText}>{formatDate(startDate)}</Text>
              <CalendarIcon size={24} color={COLORS.textSubHeadline} />
            </TouchableOpacity>
          </AnimatedView>

          {/* ── Availability Time ── */}
          <AnimatedView animation="slideUp" delay={300} style={styles.fieldContainer}>
            <View style={styles.timeHeaderRow}>
              <Text style={styles.fieldLabel}>Availability to Receive call</Text>
              <View style={styles.timezoneRow}>
                <ClockIcon size={16} color={COLORS.textSubHeadline} />
                <Text style={styles.timezoneText}>IST</Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              {/* Start time */}
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setShowStartTimeModal(true)}
                activeOpacity={0.8}>
                <Text style={styles.timeText}>{startTime}</Text>
                <DropdownArrowIcon size={18} color={COLORS.textSubHeadline} />
              </TouchableOpacity>

              {/* End time */}
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setShowEndTimeModal(true)}
                activeOpacity={0.8}>
                <Text style={styles.timeText}>{endTime}</Text>
                <DropdownArrowIcon size={18} color={COLORS.textSubHeadline} />
              </TouchableOpacity>

              {/* Duration pill */}
              {duration ? (
                <Text style={styles.durationText}>{duration}</Text>
              ) : null}
            </View>
          </AnimatedView>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* ── Create Moment Button ── */}
        <AnimatedView animation="slideUp" delay={400} style={styles.bottomBar}>
          {/* <Shadow
            distance={6}
            startColor="rgba(72,86,92,0.29)"
            offset={[0, 4]}
            style={{ width: '100%', borderRadius: 10 }}
            containerStyle={{ width: '100%' }}
          > */}
            <AnimatedPressable 
              style={styles.createButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.createButtonText}>Create Moment</Text>
            </AnimatedPressable>
          {/* </Shadow> */}
        </AnimatedView>
      </KeyboardAvoidingView>

      {/* ── Custom Date Picker Modal ── */}
      <CustomDatePicker
        visible={showDatePicker}
        startDate={startDate}
        minimumDate={new Date()}
        onConfirm={(date) => {
          setStartDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      {/* ── Sub-category Modal ── */}
      {showSubCatModal && (
        <Modal
          visible={showSubCatModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSubCatModal(false)}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowSubCatModal(false)}>
            <Pressable style={styles.bottomSheet} onPress={() => {}}>
              <View style={styles.bottomSheetHandle} />
              <Text style={styles.bottomSheetTitle}>Select sub category</Text>
              <FlatList
                data={subCategories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.listItem,
                      item === selectedSubCategory && styles.listItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedSubCategory(item);
                      setShowSubCatModal(false);
                    }}>
                    <Text
                      style={[
                        styles.listItemText,
                        item === selectedSubCategory && styles.listItemTextSelected,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* ── Start Time Modal ── */}
      <TimePickerModal
        visible={showStartTimeModal}
        selectedTime={startTime}
        onSelect={(t) => {
          setStartTime(t);
          setShowStartTimeModal(false);
        }}
        onClose={() => setShowStartTimeModal(false)}
        title="Select Start Time"
      />

      {/* ── End Time Modal ── */}
      <TimePickerModal
        visible={showEndTimeModal}
        selectedTime={endTime}
        onSelect={(t) => {
          setEndTime(t);
          setShowEndTimeModal(false);
        }}
        onClose={() => setShowEndTimeModal(false)}
        title="Select End Time"
      />
    </SafeAreaView>
  );
};

// ─── Time Picker Modal ────────────────────────────────────────────────────────
interface TimePickerModalProps {
  visible: boolean;
  selectedTime: string;
  onSelect: (time: string) => void;
  onClose: () => void;
  title: string;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  selectedTime,
  onSelect,
  onClose,
  title,
}) => {
  if (!visible) { return null; }
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={[styles.bottomSheet, styles.timeBottomSheet]} onPress={() => {}}>
          <View style={styles.bottomSheetHandle} />
          <Text style={styles.bottomSheetTitle}>{title}</Text>
          <FlatList
            data={TIME_SLOTS}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item === selectedTime;
              return (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    isSelected && styles.listItemSelected,
                  ]}
                  onPress={() => onSelect(item)}>
                  <Text
                    style={[
                      styles.listItemText,
                      isSelected && styles.listItemTextSelected,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFBEA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#FAF8EE',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  backBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.styles.bodySemibold16,
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 24,
  },
  // ── Category ──
  section: {
    gap: 14,
  },
  sectionLabel: {
    ...FONTS.styles.bodySemibold16,
    color: COLORS.textMainHeadline,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  categoryChip: {
    width: '47%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  categoryChipText: {
    ...FONTS.styles.subTitleSemibold14,
    textAlign: 'center',
  },
  // ── Fields ──
  fieldContainer: {
    gap: 14,
  },
  fieldLabel: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.textSubHeadline,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 48,
  },
  inputText: {
    flex: 1,
    ...FONTS.styles.bodyMedium14,
    color: COLORS.textMainHeadline,
  },
  placeholderText: {
    color: COLORS.textPlaceholder,
  },
  // ── Description ──
  descriptionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.white,
    padding: 16,
    height: 109,
  },
  descriptionInput: {
    flex: 1,
    ...FONTS.styles.bodyMedium14,
    color: COLORS.textMainHeadline,
    padding: 0,
  },
  charCounter: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    fontSize: 11,
    color: '#B0B0B0',
    fontFamily: 'DM Sans',
    fontWeight: '500',
  },
  // ── Time ──
  timeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timezoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timezoneText: {
    ...FONTS.styles.bodyMedium14,
    color: COLORS.textSubHeadline,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 48,
    width: 125,
    gap: 8,
  },
  timeText: {
    ...FONTS.styles.bodyMedium14,
    color: COLORS.textMainHeadline,
    flex: 1,
  },
  durationText: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.textSubHeadline,
  },
  bottomSpacer: {
    height: 12,
  },
  // ── Bottom Bar ──
  bottomBar: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 16 : 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.textBlueWhite,
    letterSpacing: 0.1,
  },
  // ── Modals ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FCFCFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '60%',
  },

  timeBottomSheet: {
    maxHeight: '55%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.textSubHeadline,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FCFCFC',
  },
  listItemSelected: {
    backgroundColor: '#D2F0FF',
  },
  listItemText: {
    ...FONTS.styles.bodyMedium14,
    color: COLORS.textSubHeadline,
  },
  listItemTextSelected: {
    color: COLORS.textSubHeadline,
    fontWeight: '600',
  },
  listSeparator: {
    height: 1,
    backgroundColor: COLORS.white,
    marginHorizontal: 0,
  },
});
