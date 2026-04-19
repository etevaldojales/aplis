<?php
class Medico
{
    private $conn;
    private $table_name = "medicos";

    public $id;
    public $nome;
    public $CRM;
    public $UFCRM;

    public $deleted_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = "SELECT id, nome, CRM, UFCRM FROM " . $this->table_name . " WHERE deleted_at = NULL ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function getMedicoById($id)
    {
        $query = "SELECT id, nome, CRM, UFCRM FROM " . $this->table_name . " WHERE id = ? AND deleted_at IS NULL LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt;
    }

    public function create()
    {
        try {
            $query = "INSERT INTO " . $this->table_name . " SET nome=:nome, CRM=:CRM, UFCRM=:UFCRM";
            $stmt = $this->conn->prepare($query);

            $this->nome = htmlspecialchars(strip_tags($this->nome));
            $this->CRM = htmlspecialchars(strip_tags($this->CRM));
            $this->UFCRM = htmlspecialchars(strip_tags($this->UFCRM));

            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":CRM", $this->CRM);
            $stmt->bindParam(":UFCRM", $this->UFCRM);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error creating medico: " . $e->getMessage());
            return false;
        }
    }

    public function update()
    {
        try {

            $query = "UPDATE " . $this->table_name . " SET nome=:nome, CRM=:CRM, UFCRM=:UFCRM WHERE id = :id";
            $stmt = $this->conn->prepare($query);

            $this->nome = htmlspecialchars(strip_tags($this->nome));
            $this->CRM = htmlspecialchars(strip_tags($this->CRM));
            $this->UFCRM = htmlspecialchars(strip_tags($this->UFCRM));
            $this->id = htmlspecialchars(strip_tags($this->id));

            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":CRM", $this->CRM);
            $stmt->bindParam(":UFCRM", $this->UFCRM);
            $stmt->bindParam(":id", $this->id);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error updating medico: " . $e->getMessage());
            return false;
        }
    }

    public function delete()
    {
        try {
        $query = "UPDATE " . $this->table_name . " SET deleted_at = NOW() WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error deleting medico: " . $e->getMessage());
            return false;
        }
    }
}
?>