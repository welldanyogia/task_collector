<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ClassMember extends Model
{
    use HasFactory;

    public $incrementing = false; // Disable auto-incrementing for the ID
    protected $keyType = 'string'; // Specify that the ID is a string (UUID)
    protected $table = 'class_members';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'id',
        'class_id',
        'student_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Relationships.
     */
    public function class(): BelongsTo
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
