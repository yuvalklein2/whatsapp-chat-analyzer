import { Message, ChatData } from '@/types/chat';
import { parse } from 'date-fns';

export class WhatsAppParser {
  // Multiple regex patterns to handle different WhatsApp export formats
  private static readonly MESSAGE_PATTERNS = [
    // Format: [DD.MM.YYYY, HH:MM:SS] Name: Message (Hebrew/Israeli format)
    /^\[(\d{1,2}\.\d{1,2}\.\d{4}),\s+(\d{1,2}:\d{2}:\d{2})\]\s*([^:]+?):\s*(.*)$/,
    // Format: [DD.MM.YY, HH:MM:SS] Name: Message (Hebrew/Israeli format short year)
    /^\[(\d{1,2}\.\d{1,2}\.\d{2}),\s+(\d{1,2}:\d{2}:\d{2})\]\s*([^:]+?):\s*(.*)$/,
    // Format: MM/DD/YY, HH:MM - Name: Message
    /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*[-–]\s*([^:]+?):\s*(.*)$/,
    // Format: [MM/DD/YY, HH:MM:SS] Name: Message
    /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]\s*([^:]+?):\s*(.*)$/,
    // Format: DD.MM.YY, HH:MM - Name: Message (European format)
    /^(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*[-–]\s*([^:]+?):\s*(.*)$/,
    // Format: DD/MM/YYYY, HH:MM - Name: Message
    /^(\d{1,2}\/\d{1,2}\/\d{4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*[-–]\s*([^:]+?):\s*(.*)$/,
    // Format without comma: MM/DD/YY HH:MM - Name: Message
    /^(\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*[-–]\s*([^:]+?):\s*(.*)$/,
  ];
  
  private static readonly SYSTEM_MESSAGE_PATTERNS = [
    // Format: [DD.MM.YYYY, HH:MM:SS] System message (Hebrew/Israeli format)
    /^\[(\d{1,2}\.\d{1,2}\.\d{4}),\s+(\d{1,2}:\d{2}:\d{2})\]\s*([^:]*?):\s*(.*)$/,
    // System messages (no username)
    /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*[-–]\s*(.*)$/,
    /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\]\s*(.*)$/,
    /^(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)\s*[-–]\s*(.*)$/,
  ];

  // Common system message indicators that should not be treated as participants
  private static readonly SYSTEM_MESSAGE_INDICATORS = [
    // Group management
    'created group',
    'added',
    'removed',
    'left',
    'joined',
    'changed the group name',
    'changed the group description',
    'changed the group icon',
    'changed the group settings',
    'promoted',
    'demoted',
    // Security/encryption
    'messages and calls are end-to-end encrypted',
    'security code changed',
    // Other system messages
    'missed call',
    'missed voice call',
    'missed video call',
    'deleted this message',
    'this message was deleted',
    // Hebrew/other language equivalents
    'יצר קבוצה',
    'הוסיף',
    'הסיר',
    'עזב',
    'הצטרף',
    'שינה את שם הקבוצה',
    'שינה את תיאור הקבוצה',
    'שינה את תמונת הקבוצה',
  ];

  private static isSystemMessage(author: string, content: string): boolean {
    // Check if the content contains system message indicators
    const fullText = `${author} ${content}`.toLowerCase();
    
    return this.SYSTEM_MESSAGE_INDICATORS.some(indicator => 
      fullText.includes(indicator.toLowerCase())
    );
  }

  private static isValidParticipant(author: string, content: string): boolean {
    // Don't add as participant if it's a system message
    if (this.isSystemMessage(author, content)) {
      return false;
    }
    
    // Don't add very long author names (likely system messages or group names)
    if (author.length > 50) {
      return false;
    }
    
    // Don't add authors that look like phone numbers only
    if (/^\+?\d{10,15}$/.test(author.trim())) {
      return false;
    }
    
    return true;
  }

  static parseChat(content: string): ChatData {
    console.log('Parsing chat content, first 500 chars:', content.substring(0, 500));
    console.log('Total content length:', content.length);
    
    const lines = content.split('\n');
    console.log('Total lines:', lines.length);
    console.log('First 10 lines:', lines.slice(0, 10));
    
    // Show each line and whether it matches any pattern
    lines.slice(0, 5).forEach((line, index) => {
      console.log(`Line ${index + 1}: "${line.trim()}"`);
      let matched = false;
      this.MESSAGE_PATTERNS.forEach((pattern, patternIndex) => {
        if (line.match(pattern)) {
          console.log(`  ✅ Matches message pattern ${patternIndex}`);
          matched = true;
        }
      });
      if (!matched) {
        console.log(`  ❌ No pattern match`);
      }
    });
    
    const messages: Message[] = [];
    const participants = new Set<string>();
    
    let currentMessage: Partial<Message> | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Try to match regular messages first
      let messageMatch = null;
      let patternUsed = -1;
      
      for (let i = 0; i < this.MESSAGE_PATTERNS.length; i++) {
        messageMatch = trimmedLine.match(this.MESSAGE_PATTERNS[i]);
        if (messageMatch) {
          patternUsed = i;
          console.log(`Matched message pattern ${i}:`, messageMatch);
          break;
        }
      }

      // Try system message patterns if no regular message match
      let systemMatch = null;
      if (!messageMatch) {
        for (const pattern of this.SYSTEM_MESSAGE_PATTERNS) {
          systemMatch = trimmedLine.match(pattern);
          if (systemMatch) {
            console.log('Matched system message:', systemMatch);
            break;
          }
        }
      }

      if (messageMatch) {
        if (currentMessage) {
          messages.push(currentMessage as Message);
        }

        const [, date, time, author, content] = messageMatch;
        const timestamp = this.parseTimestamp(date, time, patternUsed);
        const trimmedAuthor = author.trim();
        const trimmedContent = content.trim();
        
        // Check if this is actually a system message or valid participant
        const isSystem = this.isSystemMessage(trimmedAuthor, trimmedContent);
        
        if (!isSystem && this.isValidParticipant(trimmedAuthor, trimmedContent)) {
          participants.add(trimmedAuthor);
        }
        
        currentMessage = {
          timestamp,
          author: trimmedAuthor,
          content: trimmedContent,
          isSystemMessage: isSystem
        };
      } else if (systemMatch) {
        if (currentMessage) {
          messages.push(currentMessage as Message);
        }

        const [, date, time, content] = systemMatch;
        const timestamp = this.parseTimestamp(date, time, -1);
        
        currentMessage = {
          timestamp,
          author: 'System',
          content: content.trim(),
          isSystemMessage: true
        };
      } else if (currentMessage) {
        // Continuation of previous message
        currentMessage.content += '\n' + trimmedLine;
      } else {
        // Line that doesn't match any pattern and no current message
        console.log('Unmatched line:', trimmedLine);
      }
    }

    if (currentMessage) {
      messages.push(currentMessage as Message);
    }

    const sortedMessages = messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    return {
      messages: sortedMessages,
      participants: Array.from(participants),
      dateRange: {
        start: sortedMessages[0]?.timestamp || new Date(),
        end: sortedMessages[sortedMessages.length - 1]?.timestamp || new Date()
      },
      totalMessages: sortedMessages.length
    };
  }

  private static parseTimestamp(dateStr: string, timeStr: string, patternIndex: number): Date {
    // Clean and prepare date string based on pattern
    let cleanDate = dateStr;
    let isEuropeanDotFormat = false;
    
    if (patternIndex === 0 || patternIndex === 1) {
      // Hebrew/Israeli format [DD.MM.YYYY] - keep dots, it's European format
      cleanDate = dateStr;
      isEuropeanDotFormat = true;
    } else if (patternIndex === 2) {
      // European format with dots, convert to slashes
      cleanDate = dateStr.replace(/\./g, '/');
    } else {
      // Remove any non-digit/slash/dot characters
      cleanDate = dateStr.replace(/[^\d\/\.]/g, '');
    }
    
    const cleanTime = timeStr.trim();
    
    const dateFormats = isEuropeanDotFormat ? [
      // European dot formats (DD.MM.YYYY)
      'd.M.yyyy', 'dd.M.yyyy', 'd.MM.yyyy', 'dd.MM.yyyy',
      'd.M.yy', 'dd.M.yy', 'd.MM.yy', 'dd.MM.yy'
    ] : [
      // US formats
      'M/d/yy', 'M/d/yyyy', 'MM/dd/yy', 'MM/dd/yyyy',
      // European formats  
      'd/M/yy', 'd/M/yyyy', 'dd/MM/yy', 'dd/MM/yyyy',
      // Dot separated
      'd.M.yy', 'd.M.yyyy', 'dd.MM.yy', 'dd.MM.yyyy'
    ];

    const timeFormats = [
      'H:mm',
      'HH:mm',
      'H:mm:ss',
      'HH:mm:ss',
      'h:mm a',
      'hh:mm a',
      'h:mm:ss a',
      'hh:mm:ss a'
    ];

    for (const dateFormat of dateFormats) {
      for (const timeFormat of timeFormats) {
        try {
          const dateTimeStr = `${cleanDate} ${cleanTime}`;
          const fullFormat = `${dateFormat} ${timeFormat}`;
          const parsed = parse(dateTimeStr, fullFormat, new Date());
          
          if (!isNaN(parsed.getTime())) {
            return parsed;
          }
        } catch {
          continue;
        }
      }
    }

    console.warn(`Could not parse timestamp: ${dateStr} ${timeStr}`);
    return new Date();
  }
}