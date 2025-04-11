'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessMenu, messMenuService, DayOfWeek, MealType } from '@/lib/api/services/mess-menu';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import Image from 'next/image';

const DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

const MEAL_IMAGES = {
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666',
  lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  dinner: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
};

export default function MessMenuPage() {
  const params = useParams();
  const hostelId = params.id as string;
  const [menuItems, setMenuItems] = useState<MessMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<MessMenu | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');

  const [formData, setFormData] = useState({
    day_of_week: '' as DayOfWeek,
    meal_type: '' as MealType,
    items: [] as string[],
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await messMenuService.getMessMenu(hostelId);
      setMenuItems(data);
    } catch (error) {
      toast.error('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editItem) {
        await messMenuService.updateMessMenu({
          ...formData,
          hostel_id: hostelId,
          id: editItem.id,
        });
      } else {
        await messMenuService.createMessMenu({
          ...formData,
          hostel_id: hostelId,
        });
      }

      toast.success('Menu item saved successfully');
      setOpen(false);
      setEditItem(null);
      setFormData({ day_of_week: '' as DayOfWeek, meal_type: '' as MealType, items: [] });
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to save menu item');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await messMenuService.deleteMessMenu(id, hostelId);
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const handleEdit = (item: MessMenu) => {
    setEditItem(item);
    setFormData({
      day_of_week: item.day_of_week,
      meal_type: item.meal_type.toLowerCase() as MealType,
      items: item.items,
    });
    setOpen(true);
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, ''],
    }));
  };

  const handleItemChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.day_of_week]) {
      acc[item.day_of_week] = {};
    }
    const mealType = item.meal_type.toLowerCase() as MealType;
    acc[item.day_of_week][mealType] = item;
    return acc;
  }, {} as Record<DayOfWeek, Partial<Record<MealType, MessMenu>>>);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mess Menu"
        description="Daily menu and meal schedule"
      />
      <Separator />

      <div className="flex justify-between items-center">
        <Tabs defaultValue={selectedDay} onValueChange={(value) => setSelectedDay(value as DayOfWeek)} className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            {DAYS.map(day => (
              <TabsTrigger key={day} value={day} className="text-sm">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {DAYS.map(day => (
            <TabsContent key={day} value={day} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MEAL_TYPES.map(type => {
                  const menuItem = groupedMenu[day]?.[type];
                  return (
                    <Card key={type} className="overflow-hidden">
                      <CardHeader className="relative h-48 p-0">
                        <Image
                          src={`${MEAL_IMAGES[type]}?w=600&h=400&fit=crop`}
                          alt={type}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 p-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-xl capitalize">
                              {type}
                            </CardTitle>
                            {menuItem && (
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleEdit(menuItem)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(menuItem.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        {menuItem ? (
                          <>
                            <ul className="list-disc pl-4 space-y-1">
                              {menuItem.items.map((item: string, index: number) => (
                                <li key={index} className="text-sm">{item}</li>
                              ))}
                            </ul>
                            <p className="text-xs text-muted-foreground mt-4">
                              Last updated: {format(new Date(menuItem.updated_at), 'M/d/yyyy')}
                            </p>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6">
                            <p className="text-muted-foreground text-sm">No menu set</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                setFormData({
                                  day_of_week: day,
                                  meal_type: type,
                                  items: [],
                                });
                                setOpen(true);
                              }}
                            >
                              Add Menu
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select
                value={formData.day_of_week}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, day_of_week: value as DayOfWeek }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map(day => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select
                value={formData.meal_type}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, meal_type: value as MealType }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Items</Label>
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={e => handleItemChange(index, e.target.value)}
                    placeholder="Enter menu item"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddItem}>
                Add Item
              </Button>
            </div>

            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 