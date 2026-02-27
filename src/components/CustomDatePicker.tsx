import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { COLORS, FONTS } from '../theme';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface CustomDatePickerProps {
  visible: boolean;
  startDate: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  visible,
  startDate,
  onConfirm,
  onCancel,
  minimumDate = new Date(),
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(startDate);

  useEffect(() => {
    if (visible) {
      setCurrentDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
      setSelectedDate(startDate);
    }
  }, [visible, startDate]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInCurrMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInCurrMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [currentDate]);

  const isSameDate = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const isBeforeMin = (d: Date) => {
    const min = new Date(minimumDate.getFullYear(), minimumDate.getMonth(), minimumDate.getDate());
    const curr = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return curr.getTime() < min.getTime();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable style={styles.modalBackdrop} onPress={onCancel}>
        <Pressable style={styles.bottomSheet} onPress={() => {}}>
          <View style={styles.bottomSheetHandle} />
          <Text style={styles.bottomSheetTitle}>Select Start Date</Text>

          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={prevMonth} hitSlop={10}>
              <ChevronLeftIcon size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.monthText}>{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</Text>
            <TouchableOpacity onPress={nextMonth} hitSlop={10} style={{ transform: [{ rotate: '180deg' }] }}>
              <ChevronLeftIcon size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Days Row */}
          <View style={styles.daysRow}>
            {DAYS.map((d, i) => (
              <Text key={i} style={styles.dayLabelText}>{d}</Text>
            ))}
          </View>

          {/* Dates Grid */}
          <View style={styles.datesGrid}>
            {daysInMonth.map((d, i) => {
              if (!d) return <View key={i} style={styles.dateCell} />;
              
              const isSelected = isSameDate(d, selectedDate);
              const isDisabled = isBeforeMin(d);

              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dateCell, isSelected && styles.selectedDateCell]}
                  disabled={isDisabled}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text style={[
                      styles.dateText, 
                      isSelected && styles.selectedDateText,
                      isDisabled && styles.disabledDateText
                  ]}>
                    {d.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.datePickerActions}>
            <TouchableOpacity style={styles.datePickerCancelBtn} onPress={onCancel}>
              <Text style={styles.datePickerCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.datePickerConfirmBtn} onPress={() => onConfirm(selectedDate)}>
              <Text style={styles.datePickerConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    paddingBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  monthText: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.primary,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  dayLabelText: {
    flex: 1,
    textAlign: 'center',
    ...FONTS.styles.bodyMedium14,
    color: COLORS.textSubHeadline,
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  dateCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedDateCell: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  dateText: {
    ...FONTS.styles.bodyMedium14,
    color: COLORS.textMainHeadline,
  },
  selectedDateText: {
    color: COLORS.textBlueWhite,
    fontWeight: '600',
  },
  disabledDateText: {
    color: COLORS.textPlaceholder,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  datePickerCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.textSubHeadline,
    alignItems: 'center',
  },
  datePickerCancelText: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.textSubHeadline,
  },
  datePickerConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  datePickerConfirmText: {
    ...FONTS.styles.subTitleSemibold14,
    color: COLORS.textBlueWhite,
  },
});
